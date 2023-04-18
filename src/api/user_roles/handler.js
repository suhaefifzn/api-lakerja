const autoBind = require('auto-bind');
const helpers = require('../../utils/helpers');

class UserRolesHandler {
  constructor({
    userRolesService, userRolesValidator, usersService, rolesService,
  }) {
    this._userRolesService = userRolesService;
    this._userRolesValidator = userRolesValidator;
    this._usersService = usersService;
    this._rolesService = rolesService;

    autoBind(this);
  }

  async postUserRoleHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);
    await helpers.user.isAdmin(request, authUserId);
    this._userRolesValidator.validateUserRolePayload(request.payload);

    const { mongo, payload } = request;

    await this._usersService.verifyUserId(request, payload.user_id);
    await this._userRolesService.verifyUserRoleId(mongo, payload.user_id);
    await this._rolesService.verifyRoleId(mongo, payload.role_id);

    const userRoleId = await this._userRolesService.addUserRole(mongo, payload);

    return h.response({
      status: 'success',
      data: {
        userRoleId,
      },
    }).code(201);
  }

  async putNewUserRoleHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);
    await helpers.user.isAdmin(request, authUserId);
    this._userRolesValidator.validateUserRolePayload(request.payload);

    const { mongo, payload } = request;

    await this._usersService.verifyUserId(request, payload.user_id);
    await this._rolesService.verifyRoleId(mongo, payload.role_id);
    await this._userRolesService.editUserRole(mongo, payload);

    return h.response({
      status: 'success',
      message: 'Role user berhasil diubah',
    });
  }

  async getUserRoleIdHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);
    await helpers.user.isAdmin(request, authUserId);

    const { mongo, params: { userId } } = request;

    const userRole = await this._userRolesService.getUserRoleById(mongo, userId);

    return h.response({
      status: 'success',
      data: {
        ...userRole,
      },
    });
  }
}

module.exports = { UserRolesHandler };