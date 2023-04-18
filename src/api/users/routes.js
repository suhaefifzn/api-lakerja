const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUserHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users',
    handler: handler.putUserHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
];

module.exports = { routes };