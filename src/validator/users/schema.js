const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(4).max(24).required(),
  password: Joi.string().min(8).max(64).required(),
  fullname: Joi.string().min(3).max(128).required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string(),
});

const PutUserPasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(64).required(),
});

module.exports = { UserPayloadSchema, PutUserPasswordSchema };