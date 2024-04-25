import jwt from 'jsonwebtoken';
import settings from './settings';

export default {
  encrypt: function (payload) {
    const config = settings.getSettings();
    return jwt.sign(payload, config.jwt.secretKey, {
      expiresIn: config.session.timeout,
    });
  },
  decrypt: function (token) {
    const config = settings.getSettings();
    return jwt.verify(token, config.jwt.secretKey);
  },
  encryptEmailToken: function (payload) {
    const config = settings.getSettings();
    return jwt.sign(payload, config.jwt.emailSecretKey, {
      expiresIn: config.session.emailTokenTimeout,
    });
  },
  decryptEmailToken: function (token) {
    const config = settings.getSettings();
    return jwt.verify(token, config.jwt.emailSecretKey);
  },
};
