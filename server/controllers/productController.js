import { z } from 'zod';
import prisma from '../db/db.js';
import { productRecommendationSchema } from 'shared/schemas/productSchema.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export async function createProduct(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(401).json({ message: 'At least one image is required.' });
  }

  try {
    const imageURLs = await uploadOnCloudinary(req.files);
    const product = await prisma.product.create({
      data: {
        ...req.validatedBody,
        images: imageURLs,
      },
    });
    res.status(201).json({ message: 'Product created successfully.', product });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating product.', error: error.message });
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product fetched successfully.', product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product.', error });
  }
}

export async function getProductsBySearch(req, res) {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 3)
      return res.status(403).json({
        message: 'search result not found',
        error: '',
      });
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const products = await prisma.$queryRaw`
SELECT
  p.id,
  p.name,
  p.description,
  p."basePrice",
  p.price,
  p.images,
  p.stock,
  p."createdAt",
  p."updatedAt",
  COALESCE(
    json_agg(
      json_build_object(
        'id', pc.id,
        'category', json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        )
      )
    ) FILTER (WHERE pc.id IS NOT NULL),
    '[]'::json
  ) as "ProductCategory"
FROM "Product" p
LEFT JOIN "ProductCategory" pc ON p.id = pc."productId"
LEFT JOIN "Category" c ON pc."categoryId" = c.id
WHERE 
  p."searchVector" @@ plainto_tsquery('english', ${q})
  OR EXISTS (
    SELECT 1
    FROM "ProductCategory" pc2
    JOIN "Category" c2 ON pc2."categoryId" = c2.id
    WHERE pc2."productId" = p.id
      AND to_tsvector('english', c2.name || ' ' || c2.slug) @@ plainto_tsquery('english', ${q})
  )
GROUP BY 
  p.id
ORDER BY 
  ts_rank(p."searchVector", plainto_tsquery('english', ${q})) DESC
LIMIT ${limit}
OFFSET ${offset}
    `;

    const formattedProducts = products.map((product) => ({
      ...product,
      ProductCategory: product.ProductCategory || [],
    }));

    return res.json({ products: formattedProducts });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Error fetching products.' });
  }
}

export async function getProductRecommendation(req, res) {
  const { success, error, data } = productRecommendationSchema.safeParse(
    req.query,
  );
  if (!success) {
    return res.status(400).json({
      message: 'Invalid query parameters.',
      error: z.treeifyError(error),
    });
  }

  const {
    'productId[]': productIds,
    'categorySlug[]': categorySlugs,
    limit,
  } = data;

  if (categorySlugs?.length > 0) {
    const recommendations = await prisma.productCategory.findMany({
      where: {
        AND: [
          productIds?.length ? { productId: { notIn: productIds } } : {},
          { category: { slug: { in: categorySlugs } } },
        ],
      },
      take: limit,
      select: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            price: true,
            stock: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return res.status(200).json({
      message: 'Product recommendations fetched successfully.',
      recommendations,
    });
  } else if (productIds?.length > 0) {
    const recommendations = await prisma.productCategory.findMany({
      where: {
        productId: { notIn: productIds },
        category: {
          ProductCategory: { some: { productId: { in: productIds } } },
        },
      },
      take: limit,
      select: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: true,
            price: true,
            stock: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
    return res.status(200).json({
      message: 'Product recommendations fetched successfully.',
      recommendations,
    });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;

  try {
    if (req.files && req.files.length > 0) {
      const imageURLs = await uploadOnCloudinary(req.files);
      req.validatedBody.images = imageURLs;
    }
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...req.validatedBody,
      },
    });
    res.status(200).json({ message: 'Product updated successfully.', product });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res
      .status(500)
      .json({ message: 'Error updating product.', error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(500).json({ message: 'Error deleting product.' });
  }
}

export async function createProductCollection(req, res) {
  const { categoryId, productId } = req.body;

  const addProductInCategory = await prisma.$transaction(async (tx) => {
    const productCategory = await tx.productCategory.create({
      data: {
        categoryId: categoryId,
        productId: productId,
      },
    });

    const res = await tx.category.update({
      where: { id: categoryId },
      data: {
        totalProductsCount: { increment: 1 },
      },
    });
    console.log({ res });
    return productCategory;
  });

  res.status(201).json({
    message: 'Product category was set successfully.',
    productCategory: addProductInCategory,
  });
}

export async function getProductsByCollection(req, res) {
  const { categoryId, categoryName, categorySlug } = req.query;

  if (!categoryId && !categoryName && !categorySlug) {
    return res
      .status(400)
      .json({ message: 'Category ID or Slug is required.' });
  }

  // return products by either name or id
  if (categoryId) {
    const products = await prisma.productCategory.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        product: true,
      },
    });
    return res
      .status(200)
      .json({ message: 'Products fetched successfully.', products });
  }

  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { name: categoryName || undefined },
        { slug: categorySlug || undefined },
      ],
    },
  });

  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  const products = await prisma.productCategory.findMany({
    where: {
      categoryId: category.id,
    },
    include: {
      product: true,
    },
  });
  return res
    .status(200)
    .json({ message: 'Products fetched successfully.', products });
}

export async function deleteProductCollection(req, res) {
  const { collectionId } = req.params;
  await prisma.productCategory.delete({
    where: {
      id: collectionId,
    },
  });
  res
    .status(200)
    .json({ message: 'Product category was removed successfully.' });
}
