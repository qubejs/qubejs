export default  {
  email: {
    enabled: true,
    loggerEnabled: false,
  },
  apiPrefix: {
    '/api/v1': {
      prefix: process.env.API_PREFIX || 'https://api.test.com',
    },
  },
  server: {
    host: process.env.HOST_URL || 'https://dev.homeowner.hlrapp.com',
  },
};
