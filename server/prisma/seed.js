import prisma from '../db/db.js';
const mail = 'vedantvatare73@gmail.com';
const user = await prisma.user.findUnique({
  where: {
    email: mail,
  },
});

const adminUser = await prisma.admin.create({
  data: {
    userId: user.id,
  },
});
console.log('admin created', adminUser);
