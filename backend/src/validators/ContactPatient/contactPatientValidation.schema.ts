import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import { VALIDATION_ERRORS } from '@src/errors/errorMessages';

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  coerceTypes: true,
});

addFormats(ajv);
ajvErrors(ajv);

interface ContactPatientSchema {
  patientId: string;
  phones: string[];
}

const createContactPatientSchema: JSONSchemaType<ContactPatientSchema> = {
  type: 'object',
  properties: {
    patientId: {
      type: 'string',
      nullable: false,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    phones: {
      type: 'array',
      nullable: false,
      items: {
        type: 'string',
        errorMessage: {
          type: `${VALIDATION_ERRORS.TYPE} String`,
        },
      },
      minItems: 1,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} Array`,
      },
    },
  },
  additionalProperties: false,
  required: ['patientId', 'phones'],
};

type ListContactPatientSchema = {
  q?: string;
  limit: number;
  offset: number;
};

const listContactPatientSchema: JSONSchemaType<ListContactPatientSchema> = {
  type: 'object',
  properties: {
    q: {
      type: 'string',
      nullable: true,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    limit: {
      type: 'number',
      nullable: false,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} Number`,
      },
    },
    offset: {
      type: 'number',
      nullable: false,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} Number`,
      },
    },
  },
  additionalProperties: false,
  required: ['limit', 'offset'],
};

type OptionalContactPatientSchema = {
  phone: string;
};

const updateContactPatientSchema: JSONSchemaType<OptionalContactPatientSchema> = {
  type: 'object',
  properties: {
    phone: {
      type: 'string',
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
  },
  required: ['phone'],
  additionalProperties: false,
};

export const validateCreateContactPatient = ajv.compile(createContactPatientSchema);
export const validateListContactPatient = ajv.compile(listContactPatientSchema);
export const validateUpdateContactPatient = ajv.compile(updateContactPatientSchema);
