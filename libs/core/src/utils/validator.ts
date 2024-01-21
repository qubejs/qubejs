import commons from './common';
import moment from 'moment-timezone';
import filter from 'lodash/filter';

let _object;
const setObject = (obj) => {
  _object = obj;
};

const _validators = {
  required: (value, { required, defaultValue }, fields) => {
    if (required && required(fields) === false) {
      return true;
    }
    if (value && value === defaultValue) {
      return false;
    }
    return !commons.isNullOrUndefined(value) && !!String(value).trim();
  },
  fieldName: (value) => {
    return _validators.regex(value, {
      regex: /^[a-zA-Z-_0-9]*$/,
    });
  },
  path: (value) => {
    return _validators.regex(value, {
      regex: /^[a-zA-Z_0-9\-/]*$/,
    });
  },
  oneOf: (value, { options = [] }: any = {}) => {
    return options.indexOf(value) > -1;
  },
  requiredArray: (value, { required }, fields) => {
    if (required && required(fields) === false) {
      return true;
    }
    if (!value || value.length === 0) {
      return false;
    }
    return true;
  },
  startsWith: (value, { startsWith }) => {
    if (value) {
      return value.startsWith(startsWith);
    }
    return true;
  },
  endsWith: (value, { endsWith }) => {
    if (value) {
      return value.endsWith(endsWith);
    }
    return true;
  },
  email: (value) => {
    return value && value.trim()
      ? _validators.regex(value.trim(), {
          regex:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        })
      : true;
  },
  and: (value, { validations = [], ...options }, otherFields) => {
    let returnToVal = true;
    validations.forEach((item: any) => {
      if (
        _validators[item.type] &&
        _validators[item.type](value, { ...options, ...item }, otherFields) ===
          false
      ) {
        returnToVal = false;
      }
    });
    return returnToVal;
  },
  or: (value, { validations = [], ...options }, otherFields) => {
    let returnToVal = false;
    validations.forEach((item: any) => {
      if (
        _validators[item.type] &&
        !returnToVal &&
        _validators[item.type](value, { ...options, ...item }, otherFields) ===
          true
      ) {
        returnToVal = true;
      }
    });
    return returnToVal;
  },

  exists: (value) => {
    return !!value || value === 0;
  },
  notExists: (value) => {
    return !value && value !== 0;
  },
  digits: (value, { length }) => {
    if (!commons.isNullOrUndefinedBlank(value)) {
      if (length) {
        if (value.toString().length > length) {
          return false;
        }
      }
      return new RegExp(`^[0-9]+$`, 'g').test(value);
    }
    return true;
  },
  decimals: (value, { length, negative = false, decimals = 2 }) => {
    if (!commons.isNullOrUndefinedBlank(value)) {
      if (length) {
        if (value.length > length) {
          return false;
        }
      }
      if (decimals > 0) {
        return new RegExp(
          `^${
            negative ? '\\s*[+-]?' : ''
          }(\\d+|\\.\\d+|\\d+\\.\\d{1,${decimals}}|\\d+\\.)?$`,
          'g'
        ).test(value);
      } else {
        return new RegExp(`^${negative ? '\\s*[+-]?' : ''}(\\d+)?$`, 'g').test(
          value
        );
      }
    }
    return true;
  },
  compareField: (
    value,
    { fieldName, compare = '=', trim = false },
    otherFields
  ) => {
    let val1 = commons.isNullOrUndefined(value) ? '' : value;
    let val2 = commons.isNullOrUndefined(otherFields[fieldName])
      ? ''
      : otherFields[fieldName];
    if (trim) {
      val1 = val1.trim();
      val2 = val2.trim();
    }
    if (compare === '=') {
      return val1 === val2;
    } else if (compare === '!=') {
      return val1 !== val2;
    }
    return true;
  },
  number: (value, options: any = {}) => {
    if (commons.isNullOrUndefinedBlank(value) && options.optional === true) {
      return true;
    }
    let isValid = new RegExp(
      `^\\s*[+-]?(\\d+|\\.\\d+|\\d+\\.\\d+|\\d+\\.)$`,
      'g'
    ).test(value);
    if (!commons.isNullOrUndefined(options.min) && isValid) {
      isValid = value * 1 >= options.min;
    }
    if (!commons.isNullOrUndefined(options.max) && isValid) {
      isValid = value * 1 <= options.max;
    }
    return isValid;
  },
  custom: (value, options: any = {}, ...params) => {
    const { validator = () => true, ...restOpts } = options;
    if (validator && validator(value, restOpts, ...params)) {
      return true;
    }
    return false;
  },
  phone: (value, { optional = true } = {}) => {
    return value
      ? _validators.number(value) && _validators.length(value, { exact: 10 })
      : optional !== undefined
      ? optional
      : false;
  },
  internationalphone: (value) => {
    return value
      ? !commons.isNullOrUndefined(value) &&
          _validators.regex(value, { regex: /^\+[1-9]{1}[0-9]{10,14}$/ })
      : true;
  },

  regex: (value, options) => {
    const regex =
      typeof options.regex === 'string'
        ? new RegExp(options.regex)
        : options.regex;
    return value && !commons.isNullOrUndefined(regex)
      ? regex.test(value)
      : true;
  },
  strongPassword: (value) => {
    if (value) {
      return _validators.regex(value, {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&*~]).{8,20}$/,
      });
    }
    return true;
  },
  length: (value, options) => {
    let isValid = true;
    if (
      !commons.isNullOrUndefined(options.exact) &&
      String(value).trim().length !== options.exact
    ) {
      isValid = false;
    }
    if (
      !commons.isNullOrUndefined(options.min) &&
      String(value).trim().length < options.min
    ) {
      isValid = false;
    }
    if (
      !commons.isNullOrUndefined(options.max) &&
      String(value).trim().length > options.max
    ) {
      isValid = false;
    }
    return isValid;
  },
  arrayLength: (value, options) => {
    let isValid = true;
    if (value) {
      if (
        !commons.isNullOrUndefined(options.exact) &&
        value?.length !== options.exact
      ) {
        isValid = false;
      }
      if (
        !commons.isNullOrUndefined(options.min) &&
        value?.length < options.min
      ) {
        isValid = false;
      }
      if (
        !commons.isNullOrUndefined(options.max) &&
        value?.length > options.max
      ) {
        isValid = false;
      }
    }
    return isValid;
  },
  emailphone: (value) => {
    return _validators.email(value) || _validators.phone(value);
  },
  emailinternationalphone: (value) => {
    return _validators.email(value) || _validators.internationalphone(value);
  },
  date: (value, { min = '1/1/1900', max }: any = {}) => {
    const _mind = min && typeof min === 'string' ? new Date(min) : '';
    const _maxd = max && typeof min === 'string' ? new Date(max) : '';
    let result = false;
    result = value ? new Date(value).toString() !== 'Invalid Date' : true;
    if (result && value) {
      if (_mind) {
        result = new Date(value) >= _mind;
      }
      if (_maxd) {
        result = new Date(value) <= _maxd;
      }
    }
    return result;
  },
  dateFromStr: (value, { format = 'MM/dd/yyyy' }) => {
    return value ? moment(value, format, true).isValid() : true;
  },
  Validator: (
    value,
    { validators = {}, optional = false }: any = {},
    fields
  ) => {
    const valid = new Validator(
      {
        ...validators,
      },
      { optional }
    );
    valid.setValues({ ...fields, ...value });
    const result = valid.validateAll();
    return {
      custom: true,
      isValid: result,
      errors: valid.errors,
    };
  },
  listValidator: (
    value,
    { validator, optional = false, ...options }: any = {}
  ) => {
    let isValid = true;
    if (!optional && (!value || value.length === 0)) {
      return false;
    }
    value &&
      value.forEach((item: any, idx) => {
        const result = _validators[validator](item, options);
        if (!result) {
          isValid = result;
        }
      });

    return isValid;
  },
  ArrayValidator: (value, { validators, optional = false }: any = {}) => {
    let isValid = true;
    const errors = {};
    if (!optional && (!value || value.length === 0)) {
      return false;
    }
    value &&
      value.forEach((item: any, idx) => {
        const valid = new Validator({
          ...validators,
        });
        valid.setValues(item);
        const result = valid.validateAll();
        if (!result) {
          isValid = result;
          errors[idx] = valid.errors;
        }
      });

    return {
      custom: true,
      isValid,
      errors,
    };
  },
  password: (value) => {
    return _validators.length(value, {
      min: 6,
    });
  },
  postalCN: (value) => {
    return value
      ? _validators.regex(value, {
          regex:
            /^((\d{5}-\d{4})|(\d{5})|([a-zA-Z]\d[a-zA-Z]\s?\d[a-zA-Z]\d))$/,
        })
      : true;
  },
  options: (value, config = {}, values) => {
    const {
      subType = 'array',
      options = [],
      fieldName = 'value',
      optional = false,
    }: any = config;
    const finalOptions = commons.getValue(this, options, config, values);
    if (optional && !value) {
      return true;
    }
    let item;
    switch (subType) {
      case 'array':
        item = filter(finalOptions, (item: any) => {
          if (typeof item === 'object' && item[fieldName] === value) {
            return true;
          } else if (typeof item === 'string' && item === value) {
            return true;
          }
          return false;
        });
        return item.length > 0;
    }
    return false;
  },
  array: (value, config: any = {}) => {
    if (config.valueType === 'string') {
      return (
        Array.isArray(value) &&
        value.map((i) => typeof i).filter((s) => s !== 'string').length === 0
      );
    }
    return Array.isArray(value);
  },
};

const _messages = {
  options: () => `Please select a valid option`,
  required: () => `This field is required`,
  path: () =>
    `Path should be alphanumeric (-_ is allowed) without spaces separated with /`,
  compareField: () => `This field should match compare criteria`,
  emailphone: () => `Enter a valid email or phone`,
  listValidator: () => `This field have one or more errors`,
  startsWith: (props) => `Should starts with ${props.startsWith}`,
  endsWith: (props) => `Should ends with ${props.endsWith}`,
  emailinternationalphone: () =>
    `Enter a valid email or phone with international code e.g +91`,
  email: () => `Enter a valid email`,
  fieldName: () => `Should be alphanumeric with no spaces only _ is allowed`,
  array: () => `Array does not match schema`,
  length: ({ exact, min, max }) => {
    if (exact) {
      return `Length should be ${exact} chars`;
    }
    if (min && max) {
      return `Length should be between ${min} chars and ${max} chars`;
    }
    if (min) {
      return `Length should be mininum ${min} chars`;
    }
    if (max) {
      return `Length should be less than ${max} chars`;
    }
    return `Length has invalid value`;
  },
  arrayLength: ({ exact, min, max }) => {
    if (exact) {
      return `Should be ${exact} item`;
    }
    if (min && max) {
      return `Items should be between ${min} and ${max}`;
    }
    if (min) {
      return `Atleast ${min} ${min > 1 ? 'items' : 'item'} should be selected`;
    }
    if (max) {
      return `Maxinum  ${max} ${min > 1 ? 'items' : 'item'} ${
        min > 1 ? 'are' : 'is'
      } allowed`;
    }
    return `Length has invalid value`;
  },
  phone: () => `Enter a valid phone number`,
  internationalphone: () =>
    `Enter a valid phone number with country code e.g. +91 910 989 9887`,
  password: () => `Password should be 6 characters long`,
  postalCN: () => `Enter a valid postal code`,
  strongPassword: () =>
    `Password should be min 8 characters long with atleast 1 uppercase, special character and number`,
};

class Validator {
  validators: any;
  options: any;
  errors: any;
  values: any;
  static parseMessage(message) {
    return message;
  }
  constructor(validators = {}, options = {}) {
    this.validators = validators;
    this.options = Object.assign(
      {
        emptyObject: true,
        keys: {},
        optional: false,
      },
      options
    );
    this.errors = {};
    this.values = {};
  }

  setValue(field, value) {
    this.values = {
      ...this.values,
      [field]: value,
    };
  }

  clearValues() {
    this.values = {};
    this.errors = {};
    return this;
  }

  setValues(values) {
    this.values = {
      ...this.values,
      ...values,
    };
    return this;
  }

  checkOptional(optional) {
    if (this.options.optional === true) {
      if (!commons.isNullOrUndefined(optional)) {
        return optional;
      }
    }
    if (!commons.isNullOrUndefined(optional)) {
      return optional;
    }
    return this.options.optional;
  }
  validate(field, nested?) {
    let isValid = true;
    let errorKey = '';
    let errorMessage = '';
    let extraParams = {};
    if (_object) {
      const fieldVal = _object.getDataFromKey(this.values, field, null);
      if (fieldVal) {
        this.setValue(field, fieldVal);
      }
    }
    if (this.validators[field] && this.validators[field].validators) {
      Array.isArray(this.validators[field].validators) &&
        this.validators[field].validators.forEach(
          ({ type, message, key: vErrorKey, ...rest }): any => {
            const isOptional = this.checkOptional(
              this.validators[field].optional
            );
            if (_validators[type] && (!isOptional || this.values[field])) {
              const result = _validators[type](
                this.values[field],
                { fieldName: field, ...rest },
                this.values
              );
              let final;
              if (typeof result === 'object' && result.custom === true) {
                const { isValid: isNewValid, ...rest } = result;
                final = isNewValid;
                extraParams = rest;
              } else {
                final = !!result;
              }
              if (isValid && !final) {
                isValid = false;
                errorMessage =
                  message ||
                  (_messages[type] && _messages[type](rest, this.values));
                errorKey = vErrorKey || this.options.keys[type] || '';
                return false;
              }
            }
            return undefined;
          }
        );
    } else if (this.validators[field] && this.validators[field].validator) {
      const {
        type,
        message,
        key: vErrorKey,
        ...rest
      } = this.validators[field].validator;
      const isOptional = this.checkOptional(this.validators[field].optional);
      if ((!isOptional || this.values[field]) && _validators[type]) {
        const result = _validators[type](this.values[field], rest, this.values);
        let final;

        if (typeof result === 'object' && result.custom === true) {
          const { isValid: isNewValid, ...rest } = result;
          extraParams = rest;
          final = isNewValid;
        } else {
          final = !!result;
        }
        if (isValid && !final) {
          isValid = false;
          errorMessage =
            message || (_messages[type] && _messages[type](rest, this.values));
          errorKey = vErrorKey || this.options.keys[type] || '';
        }
      }
    }
    if (isValid) {
      if (this.options.emptyObject) {
        this.errors[field] = {};
      } else {
        delete this.errors[field];
      }
    } else {
      this.errors[field] = {
        error: true,
        ...extraParams,
        errorMessage:
          Validator.parseMessage(errorMessage) ||
          Validator.parseMessage(this.validators[field].errorMessage),
      };
      if (errorKey) {
        this.errors[field].key = errorKey;
      }
    }
    if (this.validators[field] && this.validators[field].impactOn && !nested) {
      this.validators[field].impactOn.forEach((fName) => {
        if (this.values[fName]) {
          this.validate(fName, true);
        }
      });
    }
    return isValid;
  }

  validateAll() {
    this.errors = {};
    let isValid = true;
    Object.keys(this.validators).forEach((fieldName) => {
      if (!this.validate(fieldName)) {
        if (isValid) {
          this.options.onFirstFail &&
            this.options.onFirstFail(this.validators[fieldName], fieldName);
        }
        isValid = false;
      }
    });
    return isValid;
  }
}

const getValidators = () => _validators;

const addValidator = (name, fn) => {
  if (name && typeof fn === 'function') {
    _validators[name] = fn;
  }
};
const addMessage = (name, message) => {
  if (name) {
    _messages[name] = message;
  }
};

const getMessages = () => _messages;
export {
  setObject,
  Validator,
  addValidator,
  getValidators,
  addMessage,
  getMessages,
};
