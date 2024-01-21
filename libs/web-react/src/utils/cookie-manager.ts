import { utils } from '@qubejs/core';
const { Timeunit } = utils;

class CookieManager {
  cookieInfo: any;
  timeUnit: any;
  constructor() {
    this.cookieInfo = {};
    this.timeUnit = new Timeunit();
  }

  add(cname, cvalue, period = '1d', path = '/') {
    let expires = '';
    if (period) {
      const d = new Date();
      d.setTime(d.getTime() + this.timeUnit.getTimeunit(period));
      expires = d.toUTCString();
    }
    if (expires) {
      expires = `expires=${expires};`;
    }
    document.cookie = `${cname}=${cvalue};${expires}path=${path};`;
  }

  remove(cname, path = '/') {
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
  }

  get(name) {
    return this.getAll()[name];
  }

  getAll() {
    const obj = {};
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      const splitV = c.split('=');
      if (splitV[0]) {
        obj[splitV[0]] = splitV[1] || '';
      }
    }
    return obj;
  }
}

export default new CookieManager();
