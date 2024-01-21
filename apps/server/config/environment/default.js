export default {
  product: {
    name: 'REPM',
  },
  publicUrl: process.env.PUBLIC_URL || '',
  tenantCode: process.env.TENANT_CODE,
  reCaptcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY,
    secretKey: process.env.RECAPTCHA_SERVER_KEY,
  },
  email: {
    enabled: false,
    loggerEnabled: false,
    defaultFrom: 'donotreply@hlrapp.com',
    defaultFromName: 'REPM',
    messageBox: 'info@hlrapp.com',
  },
  text: {
    enabled: false,
    loggerEnabled: false,
  },
  otp: {
    expiresIn: 60 * 5, // 5 minutes
  },

  analytics: {
    gaTrackingId: 'G-DSF',
  },

  server: {
    host: 'http://dev.crm-sandbox.com',
  },
  cookie: {
    secret: 'homesecuret',
    tokenKey: 'keyforthetoken',
    checkLoginKey: 'loginkeysecuredbycore',
    secretKey: 'secretkeysecured',
    maxAge: 3 * 60 * 60 * 1000, // 3 hours
  },
  smtpSettings: {
    host: 'email-smtp.ca-central-1.amazonaws.com',
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: 'SSLv3',
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
      user: 'AKIAY2AJ745RZPYOW7ZB',
      pass: 'BJtW1jKxtvwSVePkoPy/lggP6Ta5LohpnYoEF6Nz6g6J',
    },
  },
  jwt: {
    secretKey: 'secretkeysecured22222sf',
    emailSecretKey: 'emailsecuredkey',
  },
  session: {
    secure: true,
    timeout: '3h',
    emailTokenTimeout: '7d',
  },
  privateKey: 'jhkhkjh',
  db: {
    connection: 'mongodb://',
    username: '',
    password: '',
    port: '27017',
    dbname: 'crm-homeowner-local',
    host: 'localhost',
  },
  log: 'debug',
};
