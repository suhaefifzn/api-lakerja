const Joi = require('joi');

const PostReportPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  category_id: Joi.string().required(),
  time_start: Joi.string().required(),
  report: Joi.string(),
});

const PutReportPayloadSchema = Joi.object({
  time_end: Joi.string().required(),
  report: Joi.string().required(),
});

module.exports = { PostReportPayloadSchema, PutReportPayloadSchema };