const autoBind = require('auto-bind');

class RolesHandler {
  constructor({ rolesService, rolesValidator, usersService }) {
    this._rolesService = rolesService;
    this._rolesValidator = rolesValidator;
    this._usersService = usersService;

    autoBind(this);
  }

  async postRoleHandler(request, h) {
    this._rolesValidator.validateRolePayload(request.payload);

    const { mongo, payload } = request;
    const roleId = await this._rolesService.addRole(mongo, payload);

    return h.response({
      status: 'success',
      data: {
        roleId,
      },
    });
  }

  async getAllRolesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { mongo } = request;

    await this._usersService.verifyUserId(request, userId);

    const roles = await this._rolesService.getAllRoles(mongo);

    return h.response({
      status: 'success',
      data: {
        roles,
      },
    });
  }
}

module.exports = { RolesHandler };