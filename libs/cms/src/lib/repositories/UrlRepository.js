const utils = require('../utils');
var { getSettings } = require('../settings');
const tokenManager = require('../tokenManager');
const settings = getSettings();
const URL_CONFIG = {
  LOGIN: settings.urlMapping['login'],
};

class UrlRepository {
  constructor() {
    this.init();
  }

  init() {}

  getDefaultUrls() {
    return {
      loginUrl: utils.url.create(URL_CONFIG.LOGIN),
    };
  }
}

module.exports = UrlRepository;
