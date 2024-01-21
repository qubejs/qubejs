import moment from 'moment-timezone';

class DataTypes {
  isNullOrUndefined(value) {
    return value === null || value === undefined;
  }

  isObject(value) {
    return value && typeof value === 'object';
  }

  bool(defaultValue) {
    return (value) => {
      return Boolean(value) || defaultValue;
    };
  }

  string(defaultValue) {
    return (value) => {
      return (!this.isNullOrUndefined(value) && value.toString()) || defaultValue;
    };
  }

  number(defaultValue) {
    return (value) => {
      const numRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;
      const finalValue = !this.isNullOrUndefined(value) ? value.toString() : '';
      if (!finalValue.match(numRegex) && !this.isObject(value)) {
        return value;
      }
      if (!this.isNullOrUndefined(value) && !isNaN(value)) {
        return value * 1;
      } else if (this.isNullOrUndefined(value) && !isNaN(defaultValue)) {
        return defaultValue * 1;
      } else if (typeof value === 'string') {
        return value;
      }
      return this.isObject(value) ? undefined : value && value.toString();
    };
  }

  any(defaultValue) {
    return (value) => {
      return this.isNullOrUndefined(value) ? defaultValue : value;
    };
  }
  array(defaultValue) {
    return (value) => {
      return this.isNullOrUndefined(value) ? defaultValue : value;
    };
  }

  object(defaultValue) {
    return (value) => {
      return value === undefined ? defaultValue : value;
    };
  }

  date(defaultValue) {
    return (value) => {
      return (value && new Date(value)) || defaultValue;
    };
  }

  dateISOString(defaultValue) {
    return (value) => {
      return this.isNullOrUndefined(value)
        ? defaultValue && new Date(defaultValue).toISOString()
        : value && moment(value).isValid()
        ? new Date(value).toISOString()
        : value;
    };
  }
}

export default new DataTypes();
