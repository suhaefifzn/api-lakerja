const { InvariantError } = require('../../exceptions/InvariantError');
const { PostReportPayloadSchema, PutReportPayloadSchema } = require('./schema');

const ReportsValidator = {
  validatePostReportPayload: (payload) => {
    const validationResult = PostReportPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutReportPayload: (payload) => {
    const validationResult = PutReportPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { ReportsValidator };