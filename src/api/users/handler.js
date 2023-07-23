const autoBind = require('auto-bind');
const helpers = require('../../utils/helpers');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._service.verifyUserId(request, authUserId);
    await helpers.user.isAdmin(request, authUserId);

    this._validator.validateUserPayload(request.payload);
    helpers.user.account.containsWhitespace('Username', request.payload.username);
    helpers.user.account.containsWhitespace('Password', request.payload.password);

    const user = {
      username: request.payload.username,
      password: request.payload.password,
      fullname: request.payload.fullname,
      email: request.payload.email ? request.payload.email : null,
      phone: request.payload.phone ? request.payload.phone : null,
    };

    const userId = await this._service.addUser(request, user);

    return h.response({
      status: 'success',
      data: {
        userId,
      },
    }).code(201);
  }

  async putUserHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._service.verifyUserId(request, authUserId);

    const { change } = request.query;

    if (change === 'password') {
      this._validator.validatePutUserPasswordPayload(request.payload);
      helpers.user.account.containsWhitespace('Password', request.payload.newPassword);

      await this._service.editUserPassword({
        request,
        authUserId,
        payload: request.payload,
      });

      return h.response({
        status: 'success',
        message: 'Password berhasil diperbarui',
      });
    }

    const {
      newUsername, newFullname, newEmail, newPhone, password,
    } = request.payload;

    helpers.user.account.containsWhitespace('Username', newUsername);

    const payload = {
      password,
      username: newUsername,
      fullname: newFullname,
      email: newEmail,
      phone: newPhone,
    };

    this._validator.validateUserPayload(payload);
    await this._service.editUser({ request, authUserId, payload });

    return h.response({
      status: 'success',
      message: 'Data user berhasil diperbarui',
    });
  }

  async getUserHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._service.verifyUserId(request, authUserId);

    const { get } = request.query;

    if (get === 'all') {
      await helpers.user.notEmployee(request, authUserId);

      const users = await this._service.getAllUsers(request);
      return h.response({
        status: 'success',
        data: {
          users,
        },
      });
    }

    const user = await this._service.getUser(request, authUserId);

    return h.response({
      status: 'success',
      data: {
        user,
      },
    });
  }
}

module.exports = { UsersHandler };