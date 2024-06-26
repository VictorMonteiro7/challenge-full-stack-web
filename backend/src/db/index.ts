import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      async softDelete<T>(this: T, id: string | string[], userId: string) {
        const context = Prisma.getExtensionContext(this);
        const modelName = context.$name;
        if (!modelName) throw new Error('Model name not found');
        try {
          const isMultiple = typeof id === 'object' && Array.isArray(id);
          prisma.$transaction(async (trx) => {
            if (isMultiple) {
              // eslint-disable-next-line
              await (trx as any)[modelName].updateMany({
                where: { id: { IN: id } },
                data: {
                  updatedAt: new Date(),
                  deletedAt: new Date(),
                },
              });
              await trx.actionLogs.createMany({
                data: id.map((i) => ({
                  userId,
                  action: 'DELETE',
                  modelName: modelName.toUpperCase(),
                  modelId: i,
                  createdAt: new Date(),
                })),
              });
              return;
            }
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
                modelName: modelName.toUpperCase(),
                modelId: id,
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
        id: string | string[],
        ...args: any // eslint-disable-line
      ) {
        const context = Prisma.getExtensionContext(this);
        const modelName = context.$name;
        if (!modelName) throw new Error('Model name not found');
        try {
          prisma.$transaction(async (trx) => {
            const isMultiple = typeof id === 'object' && Array.isArray(id);
            if (isMultiple) {
              await trx.actionLogs.createMany({
                data: id.map((i) => ({
                  userId,
                  action: 'UPDATE',
                  modelName: modelName.toUpperCase(),
                  modelId: i,
                  modifiedFields: Object.keys(args[0].data),
                  createdAt: new Date(),
                })),
              });
              return;
            }
            await (trx as any)[modelName].update(...args); // eslint-disable-line

            await trx.actionLogs.create({
              data: {
                userId,
                action: 'UPDATE',
                modelName: modelName.toUpperCase(),
                modelId: id,
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
