import { Router } from 'express';
import * as Middlewares from '@src/middlewares';
import * as UserController from '@src/controllers/User';
import * as PatientController from '@src/controllers/Patient';
import * as ContactPatientController from '@src/controllers/ContactPatient';
import * as Validator from '@src/validators';

const route = Router();

route.post(
  '/register',
  Validator.default.addUserValidator,
  UserController.Register
);

route.post('/login', UserController.Login);

// user info
route.get('/user', Middlewares.CheckToken, UserController.GetUserInfo);

route.delete('/user', Middlewares.CheckToken, UserController.Delete);

// patient info
route.post(
  '/patients',
  Middlewares.CheckToken,
  Validator.default.addPatientValidator,
  PatientController.CreatePatient
);

route.get(
  '/patients/list',
  Middlewares.CheckToken,
  Validator.default.listPatientsValidator,
  PatientController.ListPatients
);

route.get(
  '/patients/:id',
  Middlewares.CheckToken,
  PatientController.GetPatient
);

route.put(
  '/patients/:id',
  Middlewares.CheckToken,
  Validator.default.updatePatientValidator,
  PatientController.UpdatePatient
);

route.delete(
  '/patients/:id',
  Middlewares.CheckToken,
  PatientController.DeletePatient
);

// contact patient
route.post(
  '/patients/:patientId/contact',
  Middlewares.CheckToken,
  ContactPatientController.CreateContactPatient
);

route.get(
  '/patients/:patientId/contact/list',
  Middlewares.CheckToken,
  ContactPatientController.ListContactPatient,
  ContactPatientController.ListContactPatient
);

route.put(
  '/patients/:patientId/contact/:contactId',
  Middlewares.CheckToken,
  Validator.default.updateContactPatientValidator,
  ContactPatientController.UpdateContactPatient
);

route.delete(
  '/patients/:patientId/contact/:contactId',
  Middlewares.CheckToken,
  ContactPatientController.DeleteContactPatient
);

export default route;
