const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor({
    authenticationsService, authenticationsValidator, usersService, tokenManager,
  }) {
    this._authenticationsService = authenticationsService;
    this._authenticationsValidator = authenticationsValidator;
    this._usersService = usersService;
    this._tokenManager = tokenManager;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._authenticationsValidator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._usersService
      .verifyUserCredential({ request, username, password });

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(request, refreshToken);

    return h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler(request, h) {
    this._authenticationsValidator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(request, refreshToken);

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
  }

  async deleteAuthenticationHandler(request, h) {
    this._authenticationsValidator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(request, refreshToken);
    await this._authenticationsService.deleteRefreshToken(request, refreshToken);

    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}

module.exports = { AuthenticationsHandler };