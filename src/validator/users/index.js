const { InvariantError } = require('../../exceptions/InvariantError');
const { UserPayloadSchema, PutUserPasswordSchema } = require('./schema');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutUserPasswordPayload: (payload) => {
    const validationResult = PutUserPasswordSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { UsersValidator };