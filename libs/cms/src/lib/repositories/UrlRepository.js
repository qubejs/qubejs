const utils = require('@qubejs/core');
var { getSettings } = require('../settings');
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
