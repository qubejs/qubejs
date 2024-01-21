class QueryString {
  input: any;
  isString: boolean;
  isObject: boolean;
  constructor(params: any = {}) {
    this.input = params;
    this.isString = !!params && typeof params === 'string';
    this.isObject = !!params && typeof params === 'object';
  }

  toString() {
    let str = '';
    if (this.isObject) {
      Object.keys(this.input).forEach((key) => {
        if (this.input[key]) {
          str +=
            (str ? '&' : '') + key + '=' + encodeURIComponent(this.input[key]);
        }
      });
    }
    return str ? '?' + str : str;
  }

  toObject() {
    const obj: any = {};
    if (this.isString) {
      const runInput = this.input.substr(this.input.indexOf('?')) ? this.input.substr(this.input.indexOf('?') + 1) : '';
      runInput.split('&').forEach((keyValue: string) => {
        const split = keyValue.split('=');
        obj[split[0]] = decodeURIComponent(split[1]);
      });
    }
    return obj;
  }
}

export default QueryString;
