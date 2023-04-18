const Joi = require('joi');

const UserRolePayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  role_id: Joi.string().required(),
});

module.exports = { UserRolePayloadSchema };