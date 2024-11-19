// var ip = require('ip');

export default {
  email: {
    enabled: false,
    loggerEnabled: true,
    // loggerPath: paths.emailCache,
  },
  server: {
    host: 'http://localhost:6004',
  },
  apiPrefix: {
    '/strapi/api': {
      prefix: process.env.STRAPI_API_PREFIX || 'http://localhost:1337',
    },
  },
  log: 'debug',
};
