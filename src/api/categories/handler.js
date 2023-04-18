const autoBind = require('auto-bind');
const helpers = require('../../utils/helpers');

class CategoriesHandler {
  constructor({ categoriesService, categoriesValidator, usersService }) {
    this._categoriesService = categoriesService;
    this._categoriesValidator = categoriesValidator;
    this._usersService = usersService;

    autoBind(this);
  }

  async postCategoryHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);
    await helpers.user.isAdmin(request, authUserId);
    this._categoriesValidator.validateCategoryPayload(request.payload);

    const categoryId = await this._categoriesService
      .addCategory(request.mongo, request.payload);

    return h.response({
      status: 'success',
      data: {
        categoryId,
      },
    }).code(201);
  }

  async getAllCategoriesHandler(request, h) {
    const { id: authUserId } = request.auth.credentials;

    await this._usersService.verifyUserId(request, authUserId);
    await helpers.user.hasRole(request, authUserId);

    const categories = await this._categoriesService
      .getAllCategories(request.mongo);

    return h.response({
      status: 'success',
      data: {
        categories,
      },
    });
  }
}

module.exports = { CategoriesHandler };