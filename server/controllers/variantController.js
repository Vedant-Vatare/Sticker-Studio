import prisma from '../db/db.js';

const generateSKU = (productId, options) => {
  const sorted = options.sort((a, b) => a.name.localeCompare(b.name));
  const parts = sorted.map(
    (opt) => `${opt.name.toUpperCase()}-${opt.value.toUpperCase()}`,
  );
  return `${productId}-${parts.join('&')}`;
};

export async function createProductVariant(req, res) {
  const optionIds = req.productVariantData.variant;
  const options = await prisma.option.findMany({
    where: {
      id: {
        in: optionIds,
      },
    },
  });
  const validIds = new Set(options.map((o) => o.id));

  const invalidIds = optionIds.filter((id) => !validIds.has(id));

  if (invalidIds.length > 0) {
    return res
      .status(400)
      .json({ error: 'variant contains invalid ids', invalidIds });
  }
  const SKU = generateSKU(req.productVariantData.productId, options);

  const productVariant = await prisma.productVariant.create({
    data: {
      ...req.productVariantData,
      sku: SKU,
    },
  });
  return res
    .status(201)
    .json({ message: 'productVariant added successfully', productVariant });
}

export async function getAllVariants(req, res) {
  const { productId } = req.params;
  const productVariants = await prisma.productVariant.findMany({
    where: {
      productId,
    },
  });
  const varientIds = productVariants.map((v) => v.variant).flat(2);

  const options = await prisma.option.findMany({
    where: {
      id: {
        in: varientIds,
      },
    },
  });
  return res.status(200).json({
    message: 'variants fetched successfully',
    productVariants,
    options,
  });
}

export async function updateProductVariant(req, res) {
  const { id } = req.params;
  const productVariant = await prisma.productVariant.update({
    where: { id },
    data: req.updateData,
  });

  return res
    .status(200)
    .json({ message: 'product variant was updated', productVariant });
}
export async function deleteProductVariant(req, res) {
  try {
    const { id } = req.params;
    await prisma.productVariant.delete({
      where: { id },
    });
    return res
      .status(200)
      .json({ message: 'product variant was deleted successfully' });
  } catch (e) {
    if ((e.code = 'P2025')) {
      return res.status(400).json({ error: 'product variant not found' });
    }
  }
}

export async function createOption(req, res) {
  try {
    const option = await prisma.option.create({
      data: req.body,
    });

    return res.status(201).json({
      success: true,
      data: option,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Option with this name and value already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create option',
      error: error.message,
    });
  }
}

export async function getAllOptions(_, res) {
  const options = await prisma.option.findMany({});
  return res.status(200).json({ options });
}

export async function getOptionByName(req, res) {
  const { name } = req.params;
  if (!name) return res.status(400).json({ error: 'invalid name for option' });
  const options = await prisma.option.findMany({
    where: {
      name,
    },
  });

  if (options.length <= 0) {
    return res.status(400).json({ error: 'given option does not exists' });
  }
  return res.status(200).json({ options });
}

export async function updateOption(req, res) {
  const { id } = req.params;

  const option = await prisma.option.update({
    where: { id },
    data: req.updateData,
    select: {
      id: true,
      name: true,
      value: true,
    },
  });

  return res
    .status(200)
    .json({ message: 'varaint option was updated', option });
}

export async function deleteOption(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'invalid option data' });
    }
    await prisma.option.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'variant option was deleted' });
  } catch (e) {
    return res.status(400).json({ error: 'variant not found' });
  }
}
