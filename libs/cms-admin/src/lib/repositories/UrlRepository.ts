import { utils } from '@qubejs/core';
import _settings from '../settings';

const settings = _settings.getSettings();
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

export default UrlRepository;
