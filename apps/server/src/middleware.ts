import { utils, Response } from '@qubejs/core';
// import { features } from '@qubejs/cms-admin';
import settings from './settings';
import apiConfig from './api.config';
import apiValidationRules from './api.validation.rules';
const APP_KEY = process.env.APPLICATION_KEY;
// console.log(features);
// const { middleware } = features.adminPanel;
export default function (req, res, next) {
  let isPublic = false;
  let isAdmin = false;
  let isSecured = false;
  // const result = middleware()(req, res, next);
  // if (result !== undefined) {
  //   return result;
  // }
  utils.logger.log('Middleware:' + req.method + req.originalUrl);
  settings.api.public.forEach(function (urlReg) {
    // utils.logger.log('Middleware:checking for public api:' + req.originalUrl, ' -> ', urlReg);
    if (req.originalUrl.match(urlReg)) {
      utils.logger.log(
        'Middleware:match found for public api:' + req.originalUrl
      );
      isPublic = true;
    }
  });
  settings.api.admin.forEach(function (urlReg) {
    // utils.logger.log('Middleware:checking for public api:' + req.originalUrl, ' -> ', urlReg);
    if (req.originalUrl.match(urlReg)) {
      utils.logger.log(
        'Middleware:match found for admin api:' + req.originalUrl
      );
      isAdmin = true;
    }
  });
  settings.api.secured?.forEach(function (urlReg) {
    // utils.logger.log('Middleware:checking for public api:' + req.originalUrl, ' -> ', urlReg);
    if (req.originalUrl.match(urlReg)) {
      utils.logger.log(
        'Middleware:match found for secured api:' + req.originalUrl
      );
      isSecured = true;
    }
  });
  const validator = new utils.ParamsValidator({
    originalUrl: req.originalUrl,
    beforeUrl: (url) => apiConfig.getUrl(url),
    method: req.method,
    body: req.body,
    rules: apiValidationRules,
  });

  utils.logger.log('Middleware:validating params');
  const validations = validator.validate();
  utils.logger.log('Middleware:validatd  params');
  const applicationKey = req.headers['x-application-key'];
  utils.logger.log('@before token validation');
  if (isSecured) {
    if (applicationKey && APP_KEY === applicationKey) {
      next();
    } else {
      res.status(403).send(
        new Response({
          message: 'Invalid api key',
        }).error()
      );
      return;
    }
  } else {
    // utils.logger.log(req.headers);
    next();
  }
}
