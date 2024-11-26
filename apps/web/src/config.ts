export default {
  globals: {
    path: '/content/root',
  },
  urls: {
    protected: [ '/content/dynamic/app/*', '/content/admin/*', '/content/integrations/strapi/app/*'],
  },
  urlMapping: {
    homeDashboard: '/content/app/dashboard',
    home: '/content/home',
    login: '/content/integrations/strapi/login',
    '/login': '/login',
    '/register': '/register',
    register: '/content/admin/register',
    '/content/(.*)': {
      type: 'regex',
      target: '/content/$1',
    },
  },
};
