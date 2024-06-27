import common from './common';
import Response from '../lib/response';

class CustomProcessor {
  processor: any;
  globalOptions: any;
  constructor() {
    this.processor = {
      compare: {
        equals: (value, { matchValue = '' } = {}) => {
          return value === matchValue;
        },
        notEquals: (value, { matchValue = '' } = {}) => {
          return value !== matchValue;
        },
        exists: (value) => {
          return !!value;
        },
      },

      dataType: {
        string: (value) => {
          return !common.isNullOrUndefined(value) ? value.toString() : value;
        },
        code: (value) => {
          return !common.isNullOrUndefined(value?.code)
            ? value.code.toString()
            : '';
        },
        name: (value) => {
          return !common.isNullOrUndefined(value?.name)
            ? value.name.toString()
            : '';
        },
        number: (value) => {
          return !common.isNullOrUndefined(value) ? value * 1 : value;
        },
        forceArray: (value) => {
          if (value && Array.isArray(value)) {
            return value;
          }
          return [];
        },
      },
      array: {
        join: (value) => {
          return Array.isArray(value) ? value.join(',') : value;
        },
        extractByKey: (value, { key = 'code' } = {}) => {
          return Array.isArray(value)
            ? value.map((i) => i[key]).join(',')
            : value;
        },
        extractDataArray: (result) => {
          if (result.status === Response.TYPES.SUCCESS) {
            return {
              pages: result.data.data,
            };
          }
          return undefined;
        },
      },
      globals: {
        options: (value) => {
          return this.globalOptions[value]?.toArray();
        },
        optionsText: (value, { name }: any = {}) => {
          const option = this.globalOptions[name]?.getText(value);
          return option || '';
        },
        optionsKey: (value, { name, keyName }: any = {}) => {
          const option = this.globalOptions[name].get(value);
          return (option && option[keyName]) || '';
        },
        filterOptions: (value, { optionsName, ...params }: any) => {
          if (this.globalOptions[optionsName]) {
            return this.globalOptions[optionsName].fromData(value, params);
          }
          return value;
        },
        getOptionArray: (value) => {
          if (this.globalOptions[value]) {
            return this.globalOptions[value].toArray();
          }
          return [];
        },
        getOption: (
          value,
          {
            optionsName,
            options,
            textField = 'text',
            valueField = 'value',
          }: any = {}
        ) => {
          if (options) {
            const filterOpt = options.filter((i) => i[valueField] === value);
            if (filterOpt.length > 0) {
              return {
                text: filterOpt[0][textField],
                value: filterOpt[0][valueField],
              };
            }
          }
          if (this.globalOptions[optionsName]) {
            return this.globalOptions[optionsName].get(value);
          }
          return value;
        },
      },
      authentication: {
        restrictedPermission: (value, options, { state }) => {
          return (
            state.authentication.currentUser?.allPermissions?.indexOf(value) ===
            -1
          );
        },
        hasPermission: (value, options, { state }) => {
          return (
            state.authentication.currentUser?.allPermissions?.indexOf(value) >
            -1
          );
        },
      },
    };
    this.globalOptions = {};
  }

  registerOptions(options) {
    this.globalOptions = options;
  }

  add(moduleName, actions) {
    if (!this.processor[moduleName]) {
      this.processor[moduleName] = {};
    }
    this.processor[moduleName] = {
      ...this.processor[moduleName],
      ...actions,
    };
  }

  remove(moduleName) {
    delete this.processor[moduleName];
  }

  parseCustomModule(text) {
    const moduleName =
      text.indexOf('(') > -1 ? text.substr(0, text.indexOf('(')) : text;
    const params = {};
    const fnMatch = text.match(/[(].*[)]/);
    if (fnMatch) {
      const str = fnMatch[0].substr(1, fnMatch[0].length - 2);
      const arrayParams = str.split(',');
      arrayParams.forEach((itemParam) => {
        const askVal = itemParam.trim();
        const arr = [
          askVal.substr(0, askVal.indexOf(':')),
          askVal.substr(askVal.indexOf(':') + 1).trim(),
        ];
        if (arr[0]) {
          params[arr[0]] = arr[1]?.trim() || '';
        }
      });
    }
    return {
      module: moduleName,
      params,
    };
  }

  execute(moduleAction, ...params) {
    const actions = moduleAction.split('.');
    const moduleName = actions[0];
    const action = actions[1];
    let output;
    if (this.processor[moduleName]) {
      if (this.processor[moduleName][action]) {
        output = this.processor[moduleName][action].apply(this, params);
      } else {
        throw `${moduleName}.${action} action not found`;
      }
    } else {
      throw `${moduleName} module not found`;
    }
    return output;
  }
}
const processor = new CustomProcessor();
export default processor;
export { CustomProcessor };
