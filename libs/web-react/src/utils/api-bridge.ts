import { QueryString } from './query-string';
import { messages } from './error-messages';
import EventManager from './event-manager';
import { CONSTANTS } from '../globals';
import { redirectTo } from './redirect';
const _window: any = window;

let CODES = {
  UNAUTHORIZE_CODE: 403,
  LOGIN_FAILED: 401,
  BAD_REQUEST: 400,
  GENERIC_ERROR: 500,
  NOT_FOUND: 404,
};

let TIMEOUT = 1000 * 60 * 5;

const setApiTimeout = (timeout) => {
  TIMEOUT = timeout;
};


const setErrorCodes = (newCodes) => {
  CODES = {
    ...CODES,
    ...newCodes,
  };
};

let responseParsers = {};

const addParsers = (newParsers) => {
  responseParsers = {
    ...responseParsers,
    ...newParsers,
  };
};

const getParsers = () => responseParsers;

const defaultHeaders: any = {
  'Content-Type': 'application/json',
};

export class ApiBridge {
  events: any;
  headers: any;
  constructor() {
    this.reset();
  }

  reset() {
    this.events = new EventManager();
    this.headers = {};
  }

  addHeader(name, value) {
    this.headers[name] = value;
  }

  removeHeader(name) {
    delete this.headers[name];
  }

  getCustomHeaders() {
    const url =
      _window.location !== _window.parent.location
        ? document.referrer
        : document.location.href;
    const accesstore =
      document.location.ancestorOrigins && document.location.ancestorOrigins[0];
    return {
      'x-referer': accesstore || url,
      ...this.headers,
    };
  }

  getPrefix(data) {
    const result = this.events.emit('onPrefix', data);
    return result || _window.API_SERVER || '';
  }
  getUrl(url) {
    const result = this.events.emit('onRequestUrl', url);
    return result || url;
  }

  handleCatch(ex) {
    const response = {
      status: 'error',
      error: {
        message: ex?.toString(),
        stack: ex.stack?.toString(),
      },
    };
    this.events.emit('onUnRecognizedError', response);
    return response;
  }

  get(url, params = {}, headers = {}, query = {}, { plain = false, signal }:any = {}) {
    const promisObj = fetch(
      this.getPrefix({ url, body: params }) +
        encodeURI(this.getUrl(url)) +
        new QueryString({ ...params, ...query }).toString(),
      {
        method: 'GET',
        headers: {
          ...defaultHeaders,
          ...this.getCustomHeaders(),
          ...headers,
        },
        signal: signal || AbortSignal.timeout(TIMEOUT),
      }
    );
    if (plain) {
      return promisObj;
    }
    return promisObj
      .then(this.checkStatus.bind(this))
      .then(this.parseJSON)
      .then(this.processCustomParser.bind(this))
      .then(this.messageParser.bind(this))
      .then(this.responseReader.bind(this))
      .catch(this.handleCatch.bind(this));
  }
  

  rawPost(
    url,
    body,
    headers = {},
    query = {},
    { method = 'POST', plain = false, signal }:any = {}
  ) {
    const promisObj = fetch(
      this.getPrefix({ url, body }) +
        encodeURI(this.getUrl(url)) +
        new QueryString(query).toString(),
      {
        method: method,
        headers: {
          ...this.getCustomHeaders(),
          ...headers,
        },
        body,
        signal: signal || AbortSignal.timeout(TIMEOUT),
      }
    );
    if (plain) {
      return promisObj;
    }
    return promisObj
      .then(this.checkStatus.bind(this))
      .then(this.parseJSON)
      .then(this.processCustomParser.bind(this))
      .then(this.messageParser.bind(this))
      .then(this.responseReader.bind(this))
      .catch(this.handleCatch.bind(this));
  }

  post(url, body, headers = {}, query = {}, { plain = false, signal }:any = {}) {
    const promisObj = fetch(
      this.getPrefix({ url, body }) +
        encodeURI(this.getUrl(url)) +
        new QueryString(query).toString(),
      {
        method: 'POST',
        headers: {
          ...defaultHeaders,
          ...this.getCustomHeaders(),
          ...headers,
        },
        body: JSON.stringify(body),
        signal: signal || AbortSignal.timeout(TIMEOUT),
      }
    );
    if (plain) {
      return promisObj;
    }
    return promisObj
      .then(this.checkStatus.bind(this))
      .then(this.parseJSON)
      .then(this.processCustomParser.bind(this))
      .then(this.messageParser.bind(this))
      .then(this.responseReader.bind(this))
      .catch(this.handleCatch.bind(this));
  }

  update(url, body, headers = {}, query = {}, { plain = false, signal }:any = {}) {
    const promisObj = fetch(
      this.getPrefix({ url, body }) +
        encodeURI(this.getUrl(url)) +
        new QueryString(query).toString(),
      {
        method: 'PUT',
        headers: {
          ...defaultHeaders,
          ...this.getCustomHeaders(),
          ...headers,
        },
        body: JSON.stringify(body),
        signal: signal || AbortSignal.timeout(TIMEOUT),
      }
    );
    if (plain) {
      return promisObj;
    }
    return promisObj
      .then(this.checkStatus.bind(this))
      .then(this.parseJSON)
      .then(this.processCustomParser.bind(this))
      .then(this.messageParser.bind(this))
      .then(this.responseReader.bind(this))
      .catch(this.handleCatch.bind(this));
  }

  patch(url, body = {}, headers = {}, query = {}, { plain = false, signal }:any = {}) {
    const promisObj = fetch(
      this.getPrefix({ url, body }) +
        encodeURI(this.getUrl(url)) +
        new QueryString(query).toString(),
      {
        method: 'PATCH',
        headers: {
          ...defaultHeaders,
          ...this.getCustomHeaders(),
          ...headers,
        },
        body: JSON.stringify(body),
        signal: signal || AbortSignal.timeout(TIMEOUT),
      }
    );
    if (plain) {
      return promisObj;
    }
    return promisObj
      .then(this.checkStatus.bind(this))
      .then(this.parseJSON)
      .then(this.processCustomParser.bind(this))
      .then(this.messageParser.bind(this))
      .then(this.responseReader.bind(this))
      .catch(this.handleCatch.bind(this));
  }

  delete(url, body = {}, headers = {}, query?, { plain = false, signal }:any = {}) {
    const promisObj = fetch(
      this.getPrefix({ url, body }) +
        encodeURI(this.getUrl(url)) +
        new QueryString(query).toString(),
      {
        method: 'DELETE',
        headers: {
          ...defaultHeaders,
          ...this.getCustomHeaders(),
          ...headers,
        },
        body: JSON.stringify(body),
        signal: signal || AbortSignal.timeout(TIMEOUT),
      }
    );
    if (plain) {
      return promisObj;
    }
    return promisObj
      .then(this.checkStatus.bind(this))
      .then(this.parseJSON)
      .then(this.processCustomParser.bind(this))
      .then(this.messageParser.bind(this))
      .then(this.responseReader.bind(this))
      .catch(this.handleCatch.bind(this));
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else if (response.status === CODES.LOGIN_FAILED) {
      return response;
    } else if (response.status === CODES.UNAUTHORIZE_CODE) {
      this.events.emit('onUnauthroized', response);
      return response;
    } else if (response.status === CODES.BAD_REQUEST) {
      return response;
    } else if (response.status === CODES.GENERIC_ERROR) {
      return {
        code: response.status,
        status: CONSTANTS.STATUS.UNKNOWN,
        error: {
          message: 'Unexpected error',
          key: 'UNEXPECTED_ERROR',
        },
      };
    } else if (response.status === CODES.NOT_FOUND) {
      return {
        code: response.status,
        status: CONSTANTS.STATUS.UNKNOWN,
        error: {
          message: 'Page not found',
          key: 'NOT_FOUND',
        },
      };
    } else {
      return new Promise(function (resolve) {
        resolve({
          code: response.status,
          status: CONSTANTS.STATUS.SUCCESS,
          ...(response?.data || {}),
        });
      });
    }
  }

  parseJSON(response) {
    if (response && !response.error) {
      let resp = {};
      try {
        resp = response.json();
      } catch (ex) {
        resp = {
          error: response || {},
        };
      }
      return resp;
    } else {
      return response;
    }
  }
  responseReader(response) {
    switch (response.status) {
      case CONSTANTS.STATUS.SUCCESS:
        return response;
      case CONSTANTS.STATUS.ERROR:
        switch (response.error?.handler) {
          case 'REDIRECT':
            response.error.redirectUrl &&
              redirectTo(response.error.redirectUrl);
            break;
          case 'POPUP':
            this.events.emit('onErrorPopup', response);
            break;
          case 'CUSTOM':
            this.events.emit('onCustomError', response);
            break;
          default:
            break;
        }
        return response;
      case CONSTANTS.STATUS.UNKNOWN:
        this.events.emit('onUnRecognizedError', response);
        return response;
      default:
        return response;
    }
  }

  processCustomParser(response) {
    const parser = response.parser || 'default';
    let newResult;
    if (responseParsers[parser]) {
      newResult = responseParsers[parser].call(this, response);
    }
    return newResult || response;
  }

  messageParser(response) {
    if (response?.error?.key && messages.get(response.error.key)) {
      response.error.message = messages.get(response.error.key);
      response.error.errorMessage = messages.get(response.error.key);
    }
    if (response?.errors) {
      Object.keys(response.errors).forEach((errorField) => {
        if (response.errors[errorField].errors) {
          this.messageParser(response.errors[errorField]);
        }
        if (
          response.errors[errorField].key &&
          messages.get(response.errors[errorField].key)
        ) {
          response.errors[errorField].message = messages.get(
            response.errors[errorField].key
          );
          response.errors[errorField].errorMessage = messages.get(
            response.errors[errorField].key
          );
        }
      });
    }
    if (response?.error?.errors) {
      Object.keys(response.error.errors).forEach((errorField) => {
        if (response.error.errors[errorField].errors) {
          this.messageParser(response.error.errors[errorField]);
        }
        if (
          response.error.errors[errorField].key &&
          messages.get(response.error.errors[errorField].key)
        ) {
          response.error.errors[errorField].message = messages.get(
            response.error.errors[errorField].key
          );
          response.error.errors[errorField].errorMessage = messages.get(
            response.error.errors[errorField].key
          );
        }
      });
    }
    return response;
  }
}

export default new ApiBridge();
export { setErrorCodes, getParsers, addParsers, setApiTimeout };
