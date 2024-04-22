const { ContentRepository } = require('../../repositories/ContentRepository');
const UserRepository = require('../../repositories/UserRepository');
const UserSessionRepository = require('../../repositories/UserSessionRepository');
const UserPreferenceRepository = require('../../repositories/UserPreferenceRepository');
const EmailTemplateRepository = require('../../repositories/EmailTemplateRepository');
const { Response, utils } = require('@qubejs/core');
var express = require('express');
var router = express.Router();
var settings = require('../../settings').getSettings();
var tokenManager = require('../../tokenManager');
var contentApi = require('./content');
var moduleApi = require('./module');
var emailtemplateApi = require('./emailtemplate');
const authenticationApi = require('./authentication');

const { logger } = utils;

class AdminPanel {
  constructor({ router: m_router, ...config } = {}) {
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
    var that = this;
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

        return router;
      },
    };
  }
}
const middleware = () => {
  return function (req, res, next) {
    var isFeatureAdmin = false;
    var isPublic = false;
    var tokenValidated = false;
    var websettings = settings;

    logger.log('Admin Middleware:' + req.method + req.originalUrl);
    websettings.api?.admin?.forEach(function (urlReg) {
      logger.log(
        'Admin Middleware:checking for admin api:' + req.originalUrl,
        ' -> ',
        urlReg
      );
      if (req.originalUrl.match(urlReg)) {
        logger.log(
          'Admin Middleware:match found for admin api:' + req.originalUrl,
          ' -> ',
          urlReg
        );
        isFeatureAdmin = true;
      }
    });
    websettings.api?.adminPublic?.forEach(function (urlReg) {
      logger.log(
        'Admin Middleware:checking for public api:' + req.originalUrl,
        ' -> ',
        urlReg
      );
      if (req.originalUrl.match(urlReg)) {
        logger.log(
          'Admin Middleware:match found for public api:' + req.originalUrl,
          ' -> ',
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

    if (!isPublic && isFeatureAdmin && tokenValue) {
      logger.log('Token:' + tokenValue);
      try {
        var info = tokenManager.decrypt(tokenValue);
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
  };
};
module.exports = { AdminPanel, middleware };
