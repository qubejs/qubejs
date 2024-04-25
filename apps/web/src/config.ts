export default {
  globals: {
    path: '/content/admin/root',
  },
  urls: {
    protected: [ '/content/dynamic/app/*', '/content/admin/*'],
  },
  urlMapping: {
    homeDashboard: '/content/app/dashboard',
    home: '/content/home',
    login: '/content/admin/login',
    register: '/content/admin/register',
    '/content/(.*)': {
      type: 'regex',
      target: '/content/$1',
    },
  },
};
