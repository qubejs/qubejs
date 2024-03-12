export default {
  apiPrefix: {
    '/api/v1': {
      prefix: process.env.API_PREFIX || 'https://api.test.com',
    },
  },
  db: {
    connection: 'mongodb://',
    username: '',
    password: '',
    port: '27017',
    dbname: 'db-prod',
    host: 'localhost'
  }
};
