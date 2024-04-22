let _settings = {
  api: {
    admin: ['/admin/.*'],
    adminPublic: ['/admin/login','/admin/signup','/admin/forgotpassword', '/admin/module'],
  },
  session: {
    secure: true,
    timeout: '4h',
    emailTokenTimeout: '1d',
  },
  jwt: {
    secretKey: '123secreate',
    emailSecretKey: 'email3435secret',
  },
  url: {
    version: 'v1',
    prefix: 'api',
    getUrl: function (relativeUrl) {
      return ['/', this.prefix, '/', this.version, relativeUrl].join('');
    },
  },
  urlMapping: {
    login: '/content/admin/login',
    register: '/content/admin/register',
    forgotPassword: '/content/admin/forgotpassword',
  },
  cookie: {
    secret: 'adminsecret',
    tokenKey: 'qjs-token',
    secretKey: 'qujssecret',
    maxAge: 180000000000,
  },
};

module.exports = {
  setSettings: (newSettings) => {
    _settings = {
      ..._settings,
      ...newSettings,
    };
  },
  getSettings: () => _settings,
};
