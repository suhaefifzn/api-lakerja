const Joi = require('joi');

const RolePayloadSchema = Joi.object({
  role: Joi.string().required(),
  level: Joi.number().min(1).required(),
});

module.exports = { RolePayloadSchema };