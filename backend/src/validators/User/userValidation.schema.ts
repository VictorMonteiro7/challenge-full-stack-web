import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import { VALIDATION_ERRORS } from '@src/errors/errorMessages';

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

addFormats(ajv);
ajvErrors(ajv);

interface UserSchema {
  name: string;
  email: string;
  password: string;
}

const userSchema: JSONSchemaType<UserSchema> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      nullable: false,
      minLength: 4,
      maxLength: 20,
      errorMessage: {
        minLength: `${VALIDATION_ERRORS.MIN_LENGTH} 4 character`,
        maxLength: VALIDATION_ERRORS.MAX_LENGTH,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    email: {
      type: 'string',
      format: 'email',
      nullable: false,
      errorMessage: {
        format: `${VALIDATION_ERRORS.FORMAT} Email`,
        minLength: `${VALIDATION_ERRORS.MIN_LENGTH} 4 characters`,
        maxLength: `${VALIDATION_ERRORS.MIN_LENGTH} 10 characters`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
    password: {
      type: 'string',
      nullable: false,
      errorMessage: {
        pattern: `${VALIDATION_ERRORS.PATTERN}`,
        type: `${VALIDATION_ERRORS.TYPE} String`,
      },
    },
  },
  additionalProperties: false,
  required: ['name', 'password', 'email'],
};

export const validateUser = ajv.compile(userSchema);
