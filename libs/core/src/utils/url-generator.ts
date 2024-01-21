import QueryString from './query-string';

class UrlGenerator {
  config: any;

  constructor(config: any = {}) {
    this.config = config;
  }

  setConfig(config = {}) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  ensureSlashEnd(url: string) {
    if (url.substr(url.length - 1) === '/') {
      return url;
    } else {
      return url ? url + '/' : url;
    }
  }

  ensureNoSlashStart(url: string) {
    if (url.substr(0, 1) === '/') {
      return url.substr(1);
    } else {
      return url;
    }
  }

  create(url: string, params?: object) {
    return (
      this.ensureSlashEnd(this.config.server.host) +
      this.ensureNoSlashStart(url) +
      new QueryString(params).toString()
    );
  }
}

export default UrlGenerator;
