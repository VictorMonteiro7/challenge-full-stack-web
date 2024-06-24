import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import prisma from '@src/db'
export const CheckToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [type, token] = (req.headers.authorization as string).split(' ');
    if (type !== "Bearer") {
      return res.status(401).json({ error: 'INVALID_TOKEN' });
    }
    if (!token) return res.status(400).json({ error: 'TOKEN_NOT_INFORMED' });
    const verify = JWT.verify(token, process.env.JWT_SECRET as string);
    if (!verify) return res.status(400).json({ error: 'INVALID_TOKEN' });
    const { id } = JWT.decode(token) as { id: string };
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, email: true, name: true }
    });
    if (!user) return res.status(400).json({ error: 'INVALID_TOKEN' });
    req.body.user = { ...user, id: undefined };
    req.body.userId = user.id;
    next();
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_TOKEN' });
  }
};
