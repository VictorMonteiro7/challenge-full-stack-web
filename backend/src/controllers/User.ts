import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import JWT from 'jsonwebtoken';
import prisma from '@src/db';

const JWT_SECRET = process.env.JWT_SECRET as string;
const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS as string;

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: 'WEAK_PASSWORD' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL' });
    }
    const userExists = await prisma.user.findFirst({ where: { email } });
    if (!userExists?.deletedAt) {
      return res.status(400).json({ error: 'USER_ALREADY_EXISTS' });
    }
    const salt = bcrypt.genSaltSync(parseInt(BCRYPT_SALT_ROUNDS));
    const hash = bcrypt.hashSync(password, salt);
    if (userExists?.deletedAt) {
      await prisma.user.update({
        where: { id: userExists.id },
        data: { deletedAt: null, password: hash },
      });
    } else {
      await prisma.user.create({
        data: {
          name: validator.escape(name),
          email,
          password: hash,
        },
        select: {
          id: true,
          email: true,
        },
      });
    }
    return res.status(201).json({ data: 'USER_CREATED' });
  } catch (_) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
}

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'INVALID_FIELDS' });
    }
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'USER_NOT_FOUND' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'INVALID_PASSWORD' });
    }
    const token: string = JWT.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.json({ data: { token } });
  } catch (err) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const { userId: id } = req.body;
    await prisma.user.softDelete(id, id);
    return res.status(200).json({ data: 'USER_DELETED' });
  } catch (err) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
};

export const GetUserInfo = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(400).json({ error: 'INVALID_FIELDS' });
  }
}
