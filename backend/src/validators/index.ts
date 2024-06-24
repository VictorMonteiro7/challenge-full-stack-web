import * as userValidators from './User/user.validator';
import * as patientValidators from './Patient/patient.validator';
import * as contactPatientValidators from './ContactPatient/contactPatient.validator';

export default {
  ...userValidators,
  ...patientValidators,
  ...contactPatientValidators,
};
