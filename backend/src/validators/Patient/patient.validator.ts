import { Request, Response, NextFunction } from 'express';
import { helperValidator } from '../helper';
import {
  validatePatient,
  validateListPatients,
  validateUpdatePatient,
} from './patientValidation.schema';

export const addPatientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validatePatient, 'POST', req, res, next);
};

export const listPatientsValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validateListPatients, 'GET', req, res, next);
};

export const updatePatientValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  helperValidator(validateUpdatePatient, 'PUT', req, res, next);
};

