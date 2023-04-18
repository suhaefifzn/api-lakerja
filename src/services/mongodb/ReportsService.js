/* eslint-disable import/no-extraneous-dependencies */
const moment = require('moment');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../../exceptions/InvariantError');

class ReportsService {
  async addReport(mongo, payload) {
    const _id = `report-${nanoid(16)}`;
    const dateFormat = 'HH:mm DD-MM-YYYY';
    const timeStart = moment(payload.time_start, dateFormat).toDate();
    const timeEnd = moment(payload.time_end, dateFormat).toDate();

    const report = {
      _id,
      user_id: payload.user_id,
      category: payload.category_id,
      report: payload.report,
      time_start: timeStart,
      time_end: timeEnd,
    };

    const result = await mongo.db.collection('reports')
      .insertOne(report);

    if (!result.acknowledged) {
      throw new InvariantError('Report gagal ditambahkan');
    }

    return result.insertedId;
  }

  async getAllReports({ mongo, userId, payload }) {
    const { userIdQuery, fromDate, toDate } = payload;
    const statusDate = fromDate && toDate;
    const dateFormat = 'DD-MM-YYYY';

    // filter user reports between two dates
    if (!userIdQuery && statusDate) {
      const timeStart = moment(fromDate, dateFormat).toDate();
      const timeEnd = moment(toDate, dateFormat).add(1, 'd').toDate();

      const result = await mongo.db.collection('reports')
        .find({
          $and: [
            { user_id: userId },
            { time_start: { $gte: timeStart, $lte: timeEnd } },
          ],
        }).toArray();

      return result;
    }

    // admin or leader want to filter reports employee between two dates
    if (userIdQuery && statusDate) {
      const timeStart = moment(fromDate, dateFormat).toDate();
      const timeEnd = moment(toDate, dateFormat).add(1, 'd').toDate();

      const result = await mongo.db.collection('reports')
        .find({
          $and: [
            { user_id: userIdQuery },
            { time_start: { $gte: timeStart, $lte: timeEnd } },
          ],
        }).toArray();

      return result;
    }

    // all user reports
    if (!userIdQuery && !statusDate) {
      const result = await mongo.db.collection('reports')
        .find({ user_id: userId }).toArray();

      return result;
    }
  }

  async getReportsBetweenDates(mongo, payload) {
    const { userId, fromDate, toDate } = payload;
    const statusDate = fromDate && toDate;

    if (!userId && statusDate) {
      const result = await mongo.db.collection('reports')
        .find({
          $and: [
            { user_id: userId },
            { time_start: { $gte: new Date(fromDate), $lte: new Date(toDate) } },
          ],
        }).toArray();

      return result;
    }
  }
}

module.exports = { ReportsService };