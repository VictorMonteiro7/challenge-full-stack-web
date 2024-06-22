import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (['delete', 'deleteMany'].includes(params.action.toLowerCase())) {
    if (params.action === 'delete') {
      params.action = 'update';
    } else {
      params.action = 'updateMany';
    }
    if (params.args.data !== undefined) {
      params.args.data.deletedAt = new Date();
    } else {
      params.args.data = { deletedAt: new Date() };
    }
  }
  return next(params);
});

export default prisma;
