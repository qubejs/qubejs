var { utils, Response } = require('@qubejs/core');
var settings = require('./settings');
var apiConfig = require('./api.config');
var apiValidationRules = require('./api.validation.rules');
var APP_KEY = process.env.APPLICATION_KEY;
module.exports = function (req, res, next) {
  var isPublic = false;
  var isAdmin = false;
  var isSecured = false;

  utils.logger.log('Middleware:' + req.method + req.originalUrl);
  settings.api.public.forEach(function (urlReg) {
    // utils.logger.log('Middleware:checking for public api:' + req.originalUrl, ' -> ', urlReg);
    if (req.originalUrl.match(urlReg)) {
      utils.logger.log('Middleware:match found for public api:' + req.originalUrl, ' -> ', urlReg);
      isPublic = true;
    }
  });
  settings.api.admin.forEach(function (urlReg) {
    // utils.logger.log('Middleware:checking for public api:' + req.originalUrl, ' -> ', urlReg);
    if (req.originalUrl.match(urlReg)) {
      utils.logger.log('Middleware:match found for admin api:' + req.originalUrl, ' -> ', urlReg);
      isAdmin = true;
    }
  });
  settings.api.secured?.forEach(function (urlReg) {
    // utils.logger.log('Middleware:checking for public api:' + req.originalUrl, ' -> ', urlReg);
    if (req.originalUrl.match(urlReg)) {
      utils.logger.log('Middleware:match found for secured api:' + req.originalUrl, ' -> ', urlReg);
      isSecured = true;
    }
  });
  const validator = new utils.ParamsValidator({
    originalUrl: req.originalUrl,
    beforeUrl: (url) => apiConfig.getUrl(url),
    method: req.method,
    body: req.body,
    rules: apiValidationRules
  });

  utils.logger.log('Middleware:validating params');
  const validations = validator.validate();
  utils.logger.log('Middleware:validatd  params');
  let applicationKey = req.headers['x-application-key'];
  utils.logger.log('@before token validation');
  if (isSecured) {
    if (applicationKey && APP_KEY === applicationKey) {
      next();
    } else {
      res.status(403).send(
        new Response({
          message: 'Invalid api key'
        }).error()
      );
      return;
    }
  } else {
    // utils.logger.log(req.headers);
    next();
  }
};
