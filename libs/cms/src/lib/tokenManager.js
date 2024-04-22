var jwt = require('jsonwebtoken');
var { getSettings } = require('./settings');

module.exports = {
  encrypt: function (payload) {
    const config = getSettings();
    return jwt.sign(payload, config.jwt.secretKey, {
      expiresIn: config.session.timeout,
    });
  },
  decrypt: function (token) {
    const config = getSettings();
    return jwt.verify(token, config.jwt.secretKey);
  },
  encryptEmailToken: function (payload) {
    const config = getSettings();
    return jwt.sign(payload, config.jwt.emailSecretKey, {
      expiresIn: config.session.emailTokenTimeout,
    });
  },
  decryptEmailToken: function (token) {
    const config = getSettings();
    return jwt.verify(token, config.jwt.emailSecretKey);
  },
};
