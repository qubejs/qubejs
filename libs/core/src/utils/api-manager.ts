// const _axios = require('axios');
import _axios from 'axios';
import UrlGenerator from './url-generator';

class ApiManager {
  config: any;
  axios: any;
  options: any;
  url: any;
  constructor({
    headers = {},
    domain = '',
    axios = _axios,
    url = '',
    ...options
  } = {}) {
    this.axios = axios;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    this.options = options;
    this.url =
      url ||
      new UrlGenerator({
        server: {
          host: domain,
        },
      });
  }

  addHeader(name: string, value: string) {
    this.config.headers[name] = value;
  }

  removeHeader(name: string) {
    delete this.config.headers[name];
  }

  handleResponse(res: any) {
    return {
      ax_response: res,
      success: true,
      data: res.data,
      code: res.status,
    };
  }

  handleError(res: any) {
    return {
      api_error: true,
      ax_error: res,
      error: true,
      data: res.response?.data,
      code: res.response?.status,
    };
  }

  request(url: string, body: any = {}, { method = 'get', headers = {} } = {}) {
    const finalUrl = this.url.create(url, method === 'get' ? body : {});
    return new Promise((resolve, reject) => {
      this.axios({
        method: method,
        url: finalUrl,
        headers: { ...this.config.headers, ...headers },
        data: body,
      })
        .then((response: any) => {
          resolve(this.handleResponse(response));
        })
        .catch((error: any) => {
          reject(this.handleError(error));
        });
    });
  }

  post(url: string, body?: object, options: any = {}) {
    return this.request(url, body, { ...options, method: 'post' });
  }
  get(url: string, body?: object, options: any = {}) {
    return this.request(url, body, { ...options, method: 'get' });
  }
  put(url: string, body?: object, options: any = {}) {
    return this.request(url, body, { ...options, method: 'put' });
  }
  patch(url: string, body?: object, options: any = {}) {
    return this.request(url, body, { ...options, method: 'patch' });
  }
  delete(url: string, body?: object, options: any = {}) {
    return this.request(url, body, { ...options, method: 'delete' });
  }
}

export default ApiManager;
