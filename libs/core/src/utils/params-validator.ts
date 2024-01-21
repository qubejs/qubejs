import { Validator } from './validator';

class ParamsValidator {
  options: any;
  constructor(options: any = {}) {
    this.options = Object.assign(
      {
        method: 'GET',
        rules: {},
      },
      options
    );
  }

  validate() {
    const {
      originalUrl,
      beforeUrl = (url) => url,
      method,
      body,
      rules,
    } = this.options;
    let validations = {};
    Object.keys(rules).forEach((url) => {
      if (originalUrl === beforeUrl(url)) {
        if (rules[url][method] && rules[url][method].params) {
          const params = rules[url][method].params;

          params.required &&
            params.required.forEach(function (param) {
              if (body[param] === null || body[param] === undefined) {
                validations[param] = {
                  error: true,
                  errorMessage: 'Parameter required',
                  key: 'PARAM_REQUIRED',
                };
              }
            });

          params.required &&
            Object.keys(body).forEach(function (paramKey) {
              if (
                params.required.indexOf(paramKey) === -1 &&
                (!params.optional ||
                  params.optional.indexOf(paramKey) === -1) &&
                (!rules[url][method].validators ||
                  (rules[url][method].validators &&
                    !rules[url][method].validators[paramKey]))
              ) {
                validations[paramKey] = {
                  error: true,
                  errorMessage: 'Unknown parameter',
                  key: 'PARAM_UNKNOWN',
                };
              }
            });
        }
        if (rules[url][method] && rules[url][method].validators) {
          const validators = rules[url][method].validators;
          const validator = new Validator(
            { ...validators },
            {
              emptyObject: false,
              keys: {
                required: 'PARAM_REQUIRED',
              },
            }
          );
          validator.setValues(body);
          validator.validateAll();
          validations = {
            ...validations,
            ...validator.errors,
          };
        }
      }
    });
    return validations;
  }
}

export { ParamsValidator };
