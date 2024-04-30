import { utils } from '@qubejs/core';
import accent from './accent-colors';
import _string from './string';
import { CONSTANTS } from '../globals';
const object = utils.object;
const common = utils.common;

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
      common: {
        accentByChar: (value) => {
          return accent.getColorByChar(_string.getTwoChars(value));
        },
        getTwoChars: (value) => {
          return _string.getTwoChars(value);
        },
        addClassName: (value, { oldValue = '' } = {}) => {
          return oldValue + ' ' + value;
        },
        join: (value, { fields }, { userData }) => {
          const arr = fields?.split('+');
          const values = arr
            ?.map((val) => {
              val = val.trim().replace(new RegExp('&nbsp;', 'g'), ' ');
              if (val.charAt(0) === '.') {
                return object.getDataFromKey(userData, val.substr(1));
              }
              return val;
            })
            .join('');
          return values;
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
          if (result.status === CONSTANTS.STATUS.SUCCESS) {
            return {
              pages: result.data.data,
            };
          }
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
          return state.authentication.currentUser?.allPermissions?.indexOf(value) === -1;
        },
        hasPermission: (value, options, { state }) => {
          return state.authentication.currentUser?.allPermissions?.indexOf(value) > -1;
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

export default CustomProcessor;
