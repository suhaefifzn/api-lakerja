const autoBind = require('auto-bind');
const helpers = require('../../utils/helpers');

class ReportsHandler {
  constructor({
    reportsService, reportsValidator, usersService, categoriesService,
  }) {
    this._reportsService = reportsService;
    this._reportsValidator = reportsValidator;
    this._usersService = usersService;
    this._categoriesService = categoriesService;

    autoBind(this);
  }

  async postReportHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);

    const payload = {
      user_id: authUserId,
      ...request.payload,
    };

    this._reportsValidator.validateReportPayload(payload);
    await this._categoriesService
      .verifyCategoryId(request.mongo, payload.category_id);

    const reportId = await this._reportsService
      .addReport(request.mongo, payload);

    return h.response({
      status: 'success',
      data: {
        reportId,
      },
    }).code(201);
  }

  async getAllReportsHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);

    const { userId, fromDate, toDate } = request.query;
    const statusDate = fromDate && toDate;

    if (userId && statusDate) {
      await helpers.user.notEmployee(request, authUserId);

      const reports = await this._reportsService.getAllReports({
        mongo: request.mongo,
        userId: {},
        payload: { userIdQuery: userId, fromDate, toDate },
      });

      return h.response({
        status: 'success',
        data: {
          reports,
        },
      });
    }

    if (!userId && statusDate) {
      const reports = await this._reportsService.getAllReports({
        mongo: request.mongo, userId: authUserId, payload: { fromDate, toDate },
      });
      return h.response({
        status: 'success',
        data: {
          reports,
        },
      });
    }

    if (!userId && !statusDate) {
      const reports = await this._reportsService.getAllReports({
        mongo: request.mongo, userId: authUserId, payload: {},
      });

      return h.response({
        status: 'success',
        data: {
          reports,
        },
      });
    }
  }
}

module.exports = { ReportsHandler };