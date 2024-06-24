import { Request, Response, NextFunction } from 'express';
import { helperValidator } from '../helper';
import {
  validateCreateContactPatient,
  validateListContactPatient,
  validateUpdateContactPatient,
} from './contactPatientValidation.schema';

export const addContactPatientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validateCreateContactPatient, 'POST', req, res, next);
};

export const listContactPatientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validateListContactPatient, 'GET', req, res, next);
};

export const updateContactPatientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validateUpdateContactPatient, 'PUT', req, res, next);
};
