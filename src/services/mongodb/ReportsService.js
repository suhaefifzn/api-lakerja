/* eslint-disable import/no-extraneous-dependencies */
const moment = require('moment-timezone');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../../exceptions/InvariantError');

class ReportsService {
  async addReport(mongo, payload) {
    const _id = `report-${nanoid(16)}`;
    const timeStart = moment(payload.time_start).tz('Asia/Jakarta').toDate();

    const statusCheckIn = await this.verifyCheckIn({
      mongo,
      userId: payload.user_id,
      timeStart: moment(payload.time_start).startOf('day').format(),
    });

    if (statusCheckIn.length) {
      throw new InvariantError('Waktu kehadiran kerja hari ini sudah direkam');
    }

    const report = {
      _id,
      user_id: payload.user_id,
      category_id: payload.category_id,
      category_name: payload.category_name,
      time_start: timeStart,
      time_end: null,
      report: payload.report ? payload.report : null,
    };

    const result = await mongo.db.collection('reports')
      .insertOne(report);

    if (!result.acknowledged) {
      throw new InvariantError('Report gagal ditambahkan');
    }

    return result.insertedId;
  }

  async editReport(mongo, payload) {
    const timeStart = moment().tz('Asia/Jakarta').startOf('day').format();
    const statusReport = await this.verifyCheckIn({
      mongo,
      timeStart,
      userId: payload.user_id,
    });

    if (!statusReport.length) {
      throw new InvariantError('Waktu kehadiran kerja hari ini belum terekam');
    }

    if (statusReport[0].time_end || statusReport[0].report) {
      throw new InvariantError('Anda sudah melakukan check out untuk hari ini');
    }

    const checkOutPayload = {
      time_end: moment(payload.time_end).tz('Asia/Jakarta').toDate(),
      report: payload.report,
    };

    const result = await mongo.db.collection('reports').updateOne({
      $and: [
        { user_id: payload.user_id },
        {
          time_start: {
            $gte: moment(timeStart).toDate(),
            $lt: moment(timeStart).add(1, 'd').toDate(),
          },
        },
      ],
    }, { $set: checkOutPayload });

    if (!result.acknowledged) {
      throw new InvariantError('Report gagal ditambahkan');
    }
  }

  async verifyCheckIn({ mongo, userId, timeStart }) {
    const result = await mongo.db.collection('reports').find({
      $and: [
        { user_id: userId },
        {
          time_start: {
            $gte: moment(timeStart).toDate(),
            $lt: moment(timeStart).add(1, 'd').toDate(),
          },
        },
      ],
    }).toArray();

    return result;
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
        }).sort({ time_start: -1 }).toArray();

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
        }).sort({ time_start: -1 }).toArray();

      return result;
    }

    // all user reports
    if (!userIdQuery && !statusDate) {
      const result = await mongo.db.collection('reports')
        .find({ user_id: userId }).sort({ time_start: -1 }).toArray();

      return result;
    }
  }

  async getLastReport(mongo, userId) {
    const result = await mongo.db.collection('reports').find({ user_id: userId })
      .sort({ time_start: -1 })
      .limit(1)
      .toArray();

    return result;
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