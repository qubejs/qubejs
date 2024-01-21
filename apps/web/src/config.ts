export default {
  globals: {
    path: '/ho/root',
  },
  urls: {
    protected: [ '/content/dynamic/app/*'],
  },
  urlMapping: {
    homeDashboard: '/ho/app/dashboard',
    home: '/ho/home',
    '/ho/(.*)': {
      type: 'regex',
      target: '/ho/$1',
    },
  },
};
