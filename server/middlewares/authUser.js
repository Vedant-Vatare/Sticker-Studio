import prisma from '../db/db.js';
import jwt from 'jsonwebtoken';

export async function authenticateAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      message: 'service not available',
      error: 'invalid authentication token',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await prisma.admin.findFirst({
      where: { userId: decoded.userId },
    });
    if (!admin) {
      return res.status(403).json({
        message: 'service not available',
        error: 'not a verified user',
      });
    }
    [req.userId, req.userType] = [admin.id, 'ADMIN'];
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error authenticating user', error: error.message });
  }
}

export async function authenticateUser(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      message: 'service not available',
      error: 'invalid authentication token',
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await prisma.user.findFirst({
    where: { id: decoded.userId },
  });

  if (!user) {
    return res.status(403).json({
      message: 'service not available',
      error: 'not a verified user. please login',
    });
  }
  [req.userId, req.userType] = [user.id, 'USER'];
  next();
}
