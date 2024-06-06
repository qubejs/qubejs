import common from "./common";

class QueryString {
  input: any;
  isString: boolean;
  forceArray: boolean;
  isObject: boolean;
  constructor(params: any = {}, forceArray = false) {
    this.input = params;
    this.forceArray = forceArray;
    this.isString = !!params && typeof params === 'string';
    this.isObject = !!params && typeof params === 'object';
  }

  toString() {
    let str = '';
    if (this.isObject) {
      Object.keys(this.input).forEach((key) => {
        if (Array.isArray(this.input[key]) && this.input[key].length === 1 && this.forceArray) {
          str +=
            (str ? '&' : '') + key + '=' + encodeURIComponent('o:' + JSON.stringify(this.input[key]));
        } else if (Array.isArray(this.input[key])) {
          this.input[key].forEach((itemVal) => {
            str +=
            (str ? '&' : '') + key + '=' + encodeURIComponent(itemVal);
          })
        } else if (typeof this.input[key] === 'object' && this.input[key] !== null) {
          str +=
            (str ? '&' : '') + key + '=' + encodeURIComponent('o:' + JSON.stringify(this.input[key]));
        } else if (!common.isNullOrUndefinedBlank(this.input[key])) {
          str +=
            (str ? '&' : '') + key + '=' + encodeURIComponent(this.input[key]);
        }
      });
    }
    return str ? '?' + str : str;
  }

  toObject() {
    const obj:any = {};
    if (this.isString) {
      const runInput = this.input.substr(this.input.indexOf('?') + 1);
      runInput.split('&').forEach((keyValue) => {
        const split = keyValue.split('=');
        const actualVal = decodeURIComponent(split[1]);
        if (actualVal.substr(0,2) === 'o:') {
           obj[split[0]] = JSON.parse(decodeURIComponent(actualVal.substr(2)));
        } else {
          if (Array.isArray(obj[split[0]])) {
            obj[split[0]].push(decodeURIComponent(split[1]))
          } else if (obj[split[0]]) {
            obj[split[0]] = [obj[split[0]], decodeURIComponent(split[1])];
          } else {
            obj[split[0]] = decodeURIComponent(split[1]);
          }
        }
      });
    }
    return obj;
  }
}

export default QueryString;