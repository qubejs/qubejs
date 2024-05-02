import express from 'express';
import { Response, utils } from '@qubejs/core';
import { ContentRepository } from '../../repositories/ContentRepository';
import UserRepository from '../../repositories/UserRepository';
import UserSessionRepository from '../../repositories/UserSessionRepository';
import UserPreferenceRepository from '../../repositories/UserPreferenceRepository';
import EmailTemplateRepository from '../../repositories/EmailTemplateRepository';
import _settings from '../../settings';
import tokenManager from '../../tokenManager';
import contentApi from './content';
import moduleApi from './module';
import emailtemplateApi from './emailtemplate';
import authenticationApi from './authentication';

const router = express.Router();

const { logger } = utils;
const settings = _settings.getSettings();
class AdminPanel {
  config: any;
  router: any;
  contentRepo: any;
  userRepo: any;
  userSessionRepo: any;
  userPrefRepo: any;
  emailTemplateRepo: any;
  constructor({ router: m_router, ...config }: any = {}) {
    this.config = config;
    this.router = m_router || router;
    this.contentRepo = new ContentRepository(config);
    this.userRepo = new UserRepository(config);
    this.userSessionRepo = new UserSessionRepository(config);
    this.userPrefRepo = new UserPreferenceRepository(config);
    this.emailTemplateRepo = new EmailTemplateRepository(config);
  }

  handleError(ex, res) {
    console.log(ex);
    res.status(ex.code || 500).send(new Response(ex).error());
  }

  get() {
    const that = this;
    return {
      '/admin': function (bridge) {
        /* content api  */
        contentApi({ context: that });

        /*module api */
        moduleApi({ context: that });

        /* authentication */
        authenticationApi({ context: that });

        /* email template */
        emailtemplateApi({ context: that });

        return that.router;
      },
    };
  }
}
const middleware = () => {
  return function (req, res, next) {
    let isFeatureAdmin = false;
    let isPublic = false;
    let tokenValidated = false;
    const websettings = settings;

    logger.log('Admin Middleware:' + req.method + req.originalUrl);
    websettings.api?.admin?.forEach(function (urlReg) {
      logger.log(
        'Admin Middleware:checking for admin api:' +
          req.originalUrl +
          ' -> ' +
          urlReg
      );
      if (req.originalUrl.match(urlReg)) {
        logger.log(
          'Admin Middleware:match found for admin api:' + req.originalUrl + 
          ' -> ' +
          urlReg
        );
        isFeatureAdmin = true;
      }
    });
    websettings.api?.adminPublic?.forEach(function (urlReg) {
      logger.log(
        'Admin Middleware:checking for public api:' + req.originalUrl + 
        ' -> ' +
        urlReg
      );
      if (req.originalUrl.match(urlReg)) {
        logger.log(
          'Admin Middleware:match found for public api:' + req.originalUrl + 
          ' -> ' +
          urlReg
        );
        isPublic = true;
      }
    });
    let validations = {};
    if (websettings.apiValidationRules) {
      const validator = new utils.ParamsValidator({
        originalUrl: req.originalUrl,
        beforeUrl: (url) => websettings.url.getUrl(url),
        method: req.method,
        body: req.body,
        rules: websettings.apiValidationRules,
      });
      validations = validator.validate();
    }

    const tokenValue =
      req.cookies[websettings.cookie.tokenKey] ||
      req.headers[websettings.cookie.tokenKey];
    let info;
    if (!isPublic && isFeatureAdmin && tokenValue) {
      logger.log('Token:****');
      try {
        info = tokenManager.decrypt(tokenValue);
        tokenValidated = true;
        logger.log('Admin Middleware:Token validated');
      } catch (err) {
        req.session.userData = null;
      }
      if (info) {
        req.session.userData = info;
      }
    }

    if (!isPublic && isFeatureAdmin && tokenValidated) {
      if (req.session.userData.roleCode === 'ADMIN') {
        if (Object.keys(validations).length > 0) {
          logger.log('Admin Middleware:url parameter validations failed:');
          res.status(400).send(
            new Response({
              code: 400,
              errors: validations,
            }).error()
          );
          return false;
        } else {
          // setTimeout(function () {
          next();
          return true;
          // }, 2000);
        }
      } else {
        logger.log('Admin Middleware:no access:');
        res.status(400).send(
          new Response({
            code: 400,
            key: 'INSUFFICIENT_PERMISSION',
            message: 'no permission',
          }).error()
        );
        return false;
      }
    } else if (isFeatureAdmin) {
      if (!isPublic) {
        logger.log('Admin Middleware:invalidate session:');
        res.status(403).send(
          new Response({
            code: 403,
            key: 'NOT_LOGGED_IN',
            message: 'not logged in',
          }).error()
        );
        return false;
      } else {
        next();
        return true;
      }
    }
    return undefined;
  };
};
export { AdminPanel, middleware };
