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

interface PatientSchema {
  name: string;
  phones: string[];
  document: string;
  email: string;
  gender: 'M' | 'F';
  birthdate: string;
  insuranceCardNumber: string;
}

const createPatientSchema: JSONSchemaType<PatientSchema> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      nullable: false,
      minLength: 4,
      maxLength: 100,
      errorMessage: {
        minLength: `${VALIDATION_ERRORS.MIN_LENGTH} 4 characters`,
        maxLength: `${VALIDATION_ERRORS.MAX_LENGTH} 100 characters`,
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
    document: {
      type: 'string',
      nullable: false,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    email: {
      type: 'string',
      format: 'email',
      nullable: false,
      errorMessage: {
        format: `${VALIDATION_ERRORS.FORMAT} Email`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    gender: {
      type: 'string',
      nullable: false,
      enum: ['M', 'F'],
      errorMessage: {
        enum: `${VALIDATION_ERRORS.ENUM} M or F`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    birthdate: {
      type: 'string',
      format: 'date-time',
      nullable: false,
      errorMessage: {
        format: `${VALIDATION_ERRORS.FORMAT} Date`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    insuranceCardNumber: {
      type: 'string',
      nullable: false,
      minLength: 0,
      maxLength: 20,
      errorMessage: {
        maxLength: `${VALIDATION_ERRORS.MAX_LENGTH} 20 characters`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
  },
  required: ['name', 'phones', 'document', 'email', 'gender', 'birthdate', 'insuranceCardNumber'],
};

type ListPatientsSchema = {
  q?: string;
  limit: number;
  offset: number;
};

const listPatientSchema: JSONSchemaType<ListPatientsSchema> = {
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
      minimum: 1,
      maximum: 100,
      errorMessage: {
        minimum: `${VALIDATION_ERRORS.MIN_LENGTH} 1`,
        maximum: `${VALIDATION_ERRORS.MAX_LENGTH} 100`,
        type: `${VALIDATION_ERRORS.TYPE} Number`,
      },
    },
    offset: {
      type: 'number',
      default: 0,
      minimum: 0,
      errorMessage: {
        minimum: `${VALIDATION_ERRORS.MIN_LENGTH} 0`,
        type: `${VALIDATION_ERRORS.TYPE} Number`,
      },
    },
  },
  required: ['limit', 'offset'],
};

type OptionalPatientSchema = {
  name?: string;
  phones?: {
    id: string;
    phone: string;
  }[];
  document?: string;
  email?: string;
  gender?: 'M' | 'F';
  birthdate?: string;
  insuranceCardNumber?: string;
}

const updatePatientSchema: JSONSchemaType<OptionalPatientSchema> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      nullable: true,
      minLength: 4,
      maxLength: 100,
      errorMessage: {
        minLength: `${VALIDATION_ERRORS.MIN_LENGTH} 4 characters`,
        maxLength: `${VALIDATION_ERRORS.MAX_LENGTH} 100 characters`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    phones: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            errorMessage: {
              type: `${VALIDATION_ERRORS.TYPE} String`,
            },
          },
          phone: {
            type: 'string',
            errorMessage: {
              type: `${VALIDATION_ERRORS.TYPE} String`,
            },
          },
        },
        required: ['id', 'phone'],
        errorMessage: {
          type: `${VALIDATION_ERRORS.TYPE} String`,
        },
      },
      minItems: 1,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} Array`,
      },
    },
    document: {
      type: 'string',
      nullable: true,
      errorMessage: {
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    email: {
      type: 'string',
      format: 'email',
      nullable: true,
      errorMessage: {
        format: `${VALIDATION_ERRORS.FORMAT} Email`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    gender: {
      type: 'string',
      nullable: true,
      enum: ['M', 'F'],
      errorMessage: {
        enum: `${VALIDATION_ERRORS.ENUM} M or F`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    birthdate: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      errorMessage: {
        format: `${VALIDATION_ERRORS.FORMAT} Date`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    insuranceCardNumber: {
      type: 'string',
      nullable: true,
      minLength: 0,
      maxLength: 20,
      errorMessage: {
        maxLength: `${VALIDATION_ERRORS.MAX_LENGTH} 20 characters`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
  },
  minProperties: 1,
};

export const validatePatient = ajv.compile(createPatientSchema);
export const validateListPatients = ajv.compile(listPatientSchema);
export const validateUpdatePatient = ajv.compile(updatePatientSchema);
