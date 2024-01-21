import { getValidators } from './validator';

class ValidatorCast {
  options: any;
  constructor(options: any = {}) {
    this.options = options;
  }

  cast(options, value) {
    let returnValue = '';
    const _validators = getValidators();
    const keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i];
      if (
        _validators[item] &&
        _validators[item](value, options[item]) === true
      ) {
        returnValue = options[item].value;
        break;
      }
    }
    return returnValue;
  }
}

export { ValidatorCast };
