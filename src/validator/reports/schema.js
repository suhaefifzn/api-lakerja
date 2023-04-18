const Joi = require('joi');

const ReportPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  category_id: Joi.string().required(),
  time_start: Joi.string().required(),
  time_end: Joi.string().required(),
  report: Joi.string().required(),
});

module.exports = { ReportPayloadSchema };