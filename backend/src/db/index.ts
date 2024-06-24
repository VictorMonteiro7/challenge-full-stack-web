import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      async softDelete<T>(this: T, id: string, userId: string) {
        const context = Prisma.getExtensionContext(this);
        const modelName = context.$name;
        if (!modelName) throw new Error('Model name not found');
        try {
          prisma.$transaction(async (trx) => {
            // eslint-disable-next-line
            await (trx as any)[modelName].update({
              where: { id },
              data: {
                updatedAt: new Date(),
                deletedAt: new Date(),
              },
            });
            await trx.actionLogs.create({
              data: {
                userId,
                action: 'DELETE',
                tableName: modelName.toUpperCase(),
                tableId: id,
                createdAt: new Date(),
              },
            });
          });
        } catch (err) {
          throw new Error('DELETE_ERROR');
        }
      },
      async updateWithLog<T>(
        this: T,
        userId: string,
        id: string,
        ...args: any // eslint-disable-line
      ) {
        const context = Prisma.getExtensionContext(this);
        const modelName = context.$name;
        if (!modelName) throw new Error('Model name not found');
        try {
          prisma.$transaction(async (trx) => {
            await (trx as any)[modelName].update(...args); // eslint-disable-line
            await trx.actionLogs.create({
              data: {
                userId,
                action: 'UPDATE',
                tableName: modelName.toUpperCase(),
                tableId: id,
                modifiedFields: Object.keys(args[0].data),
                createdAt: new Date(),
              },
            });
          });
        } catch (err) {
          throw new Error('UPDATE_ERROR');
        }
      },
    },
  },
});

export default prisma;
