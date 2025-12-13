import prisma from '../db/db.js';

export async function createCategory(req, res) {
  try {
    const createdCategory = await prisma.category.create({
      data: {
        name: req.body.name,
        slug: req.body.slug,
      },
    });
    return res.status(201).json({
      message: 'Category created successfully',
      category: createdCategory,
    });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({
        message: 'product category with this name already exists',
      });
    }

    console.log(e);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

export async function getAllCategories(req, res) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      totalProductsCount: true,
    },
  });
  return res.status(200).json({
    message: 'Categories fetched successfully',
    categories,
  });
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: req.body,
    });

    return res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        message: 'Category not found',
      });
    }
    throw new Error(error);
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id: id },
    });
    return res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (e) {
    if (e.code === 'P2025') {
      return res.status(404).json({
        error: 'Category not found',
      });
    }
    console.log(e);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function createProductCategory(req, res) {
  try {
    const { productId, categoryId } = req.body;
    if (!productId || !categoryId) {
      return res.status(400).json({ error: 'invalid data' });
    }

    const productCategory = await prisma.productCategory.create({
      data: {
        productId,
        categoryId,
      },
    });
    return res
      .status(201)
      .json({ message: 'product added to category', productCategory });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'product already exists in category' });
    }
    if (e.code === 'P2003') {
      return res.status(404).json({ error: 'product or category not found' });
    }

    console.log(e);
    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function getAllCategoriesForProduct(req, res) {
  try {
    const productId = req.params?.id;
    if (!productId) {
      return res.status(400).json({ error: 'invalid data' });
    }
    const categories = await prisma.productCategory.findMany({
      where: {
        productId: productId,
      },
      select: {
        category: true,
      },
    });
    return res
      .status(200)
      .json({ message: 'categories fetched successfully', categories });
  } catch (e) {
    if (e.code === 'P2003') {
      return res.status(404).json({ error: 'product or category not found' });
    }

    return res.status(500).json({ error: 'internal server error' });
  }
}

export async function deleteProductCategory(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'invalid data' });
    }

    await prisma.productCategory.delete({
      where: { id },
    });

    return res
      .status(200)
      .json({ message: 'product removed from category successfully' });
  } catch (e) {
    if (e.code === 'P2025') {
      return res
        .status(404)
        .json({ error: 'product category with given id does not exist' });
    }
    console.log(e);
    return res.status(500).json({ error: 'internal server error' });
  }
}
