const { InvariantError } = require('../../exceptions/InvariantError');
const { UserRolePayloadSchema } = require('./schema');

const UserRolesValidator = {
  validateUserRolePayload: (payload) => {
    const validationResult = UserRolePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { UserRolesValidator };