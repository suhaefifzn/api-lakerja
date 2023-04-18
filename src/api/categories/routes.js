const routes = (handler) => [
  {
    method: 'POST',
    path: '/categories',
    handler: handler.postCategoryHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
  {
    method: 'GET',
    path: '/categories',
    handler: handler.getAllCategoriesHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
];

module.exports = { routes };