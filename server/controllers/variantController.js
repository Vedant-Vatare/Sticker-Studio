import prisma from '../db/db.js';

export const createOption = async (req, res) => {
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
};

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
