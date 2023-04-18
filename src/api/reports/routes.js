const routes = (handler) => [
  {
    method: 'POST',
    path: '/reports',
    handler: handler.postReportHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
  {
    method: 'GET',
    path: '/reports',
    handler: handler.getAllReportsHandler,
    options: {
      auth: 'lakerja_jwt',
    },
  },
];

module.exports = { routes };