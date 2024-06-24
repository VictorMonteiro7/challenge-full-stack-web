import { Request, Response, NextFunction } from 'express';
import { helperValidator } from '../helper';
import { validateUser } from './userValidation.schema';

export const addUserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validateUser, 'POST', req, res, next);
};
