import { Request, Response, NextFunction } from 'express';
import { ValidateFunction } from 'ajv';
import { parseErrors } from '@src/errors/ajvError';

export const helperValidator = async (
  fn: ValidateFunction,
  method: 'POST' | 'GET' | 'PUT' | 'DELETE',
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let body;
  if (method === 'GET' || method === 'DELETE') {
    body = req.query;
  } else {
    body = req.body;
  }
  const isValid = fn(body);
  if (!isValid && fn.errors) {
    const error = await parseErrors(fn.errors);
    return res.status(400).json({ status: 'errors', code: 400, errors: error });
  }
  next();
};
