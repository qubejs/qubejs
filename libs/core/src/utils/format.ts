import datetime from './datetime';
import common from './common';
import { getSign } from './currency';

const _defaultsValues:any = {
  currency: {
    decimals: 2,
    name: 'USD',
  },
};
const config:any = {};

const currencyThousands:any = {
  INR: {
    regex: /(\d+?)(?=(\d\d)+(\d)(?!\d))(\.\d+)?/g,
    replace: '$1,',
  },
  GENERAL: {
    regex: /\d{1,3}(?=(\d{3})+(?!\d))/g,
    replace: '$&,',
  },
};

const currencyAbrConfig:any = {
  INR: {
    default: [
      {
        divisor: 1e7,
        text: 'cr',
      },
      {
        divisor: 1e5,
        text: 'lac',
        texts: 'lacs',
      },
    ],
    lowest: [
      {
        divisor: 1e7,
        text: 'cr',
      },
      {
        divisor: 1e5,
        text: 'lac',
        texts: 'lacs',
      },
      {
        divisor: 1e3,
        text: 'k',
        texts: 'k',
      },
    ],
    crabove: [
      {
        divisor: 1e7,
        text: 'cr',
      },
    ],
    high: [
      {
        divisor: 1e7,
        text: 'cr',
      },
    ],
  },
  GENERAL: {
    default: [
      {
        divisor: 1e12,
        text: 'tr',
      },
      {
        divisor: 1e9,
        text: 'bn',
      },
      {
        divisor: 1e6,
        text: 'mn',
      },
    ],
    lowest: [
      {
        divisor: 1e12,
        text: 'tr',
      },
      {
        divisor: 1e9,
        text: 'bn',
      },
      {
        divisor: 1e6,
        text: 'mn',
      },
      {
        divisor: 1e3,
        text: 'k',
      },
    ],
    high: [
      {
        divisor: 1e12,
        text: 'tr',
      },
      {
        divisor: 1e9,
        text: 'bn',
      },
    ],
  },
};

let formatters = {
  date: (value?, { format = 'MMM DD, YYYY' } = {}) => {
    return datetime.new(value).toString(format);
  },
  currency: (value?, { input = false, ...options }: any = {}) => {
    const {
      currency = _defaultsValues.currency.name,
      decimals = _defaultsValues.currency.decimals,
    } = options;
    const sign = getSign(currency) || '';
    const replacer = currencyThousands[currency] || currencyThousands.GENERAL;
    if (!common.isNullOrUndefinedBlank(value) && !isNaN(value)) {
      const hasDotAtEnd =
        value.toString().substr(value.length - 1, 1) === '.' ? true : false;
      let valNumeric = value * 1;
      let plusMin = '';
      if (valNumeric < 0) {
        plusMin = '-';
        valNumeric = Math.abs(valNumeric);
      }
      let strFinal = '';
      if (input) {
        const len =
          value.toString().indexOf('.') > -1
            ? value.toString().substr(value.indexOf('.') + 1).length
            : 0;
        strFinal =
          len >= 1
            ? valNumeric.toFixed(len > decimals ? decimals : len)
            : valNumeric.toString();
      } else {
        strFinal = valNumeric.toFixed(decimals);
      }
      return (
        plusMin +
        sign +
        strFinal.replace(replacer.regex, replacer.replace) +
        (input && hasDotAtEnd ? '.' : '')
      );
    }
    return input ? sign + value : '';
  },
  currencyAbr: (value?, options: any = {}) => {
    const {
      setName = 'default',
      currency = _defaultsValues.currency.name,
      ignore = [],
    } = options;
    const sign = getSign(currency) || '';
    let { decimals = _defaultsValues.currency.decimals } = options;
    const replacer = currencyThousands[currency] || currencyThousands.GENERAL;
    const abConfig = currencyAbrConfig[currency] || currencyAbrConfig.GENERAL;
    let postfix = '';
    const setToProcess = abConfig[setName] || abConfig.default;
    let valNumeric: any = value * 1;
    let plusMin = '';
    if (valNumeric < 0) {
      plusMin = '-';
      valNumeric = Math.abs(valNumeric);
    }
    setToProcess.forEach((config) => {
      const valAft = valNumeric / config.divisor;
      const moder = valNumeric % config.divisor;
      if (valAft >= 1 && ignore.indexOf(config.text) === -1) {
        if (moder <= 0) {
          decimals = 0;
        } else {
          decimals = 2;
        }
        valNumeric = valAft.toFixed(decimals);
        postfix = valAft < 2 ? config.text : config.texts || config.text;
      }
    });

    if (!common.isNullOrUndefinedBlank(value)) {
      return (
        plusMin +
        sign +
        (valNumeric * 1)
          .toFixed(decimals)
          .replace(replacer.regex, replacer.replace) +
        (postfix ? ` ${postfix}` : '')
      );
    }
    return '';
  },
  phoneNumber: (value) => {
    value = common.isNullOrUndefined(value) ? '' : value.toString();
    const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (!x || !value) {
      return value;
    }
    return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
  },
  custom: (value, { format = (value) => value, ...rest }: any) => {
    return format(value, rest);
  },
  strFix: (value, { postfix, prefix }: any = {}) => {
    return (prefix || '') + (value || '') + (postfix || '');
  },
  percentage: (value, options: any = {}) => {
    const { sign = '%', fixed = 2 } = options;
    return !common.isNullOrUndefinedBlank(value) ? (value * 1).toFixed(fixed) + sign : '';
  },
  absPercentage: (value, { decimals = 2, sign = '%' }) => {
    let val = Math.abs(value * 1).toString();
    if (decimals !== undefined) {
      val = Math.abs(value * 1).toFixed(decimals);
    }
    return val + sign;
  },
  keyValue: (value, { options = {}, defaultValue = '' } = {}) => {
    let finalOptions;
    if (typeof options === 'function') {
      finalOptions = options();
    } else {
      finalOptions = options;
    }
    if (finalOptions) {
      if (typeof finalOptions.get === 'function') {
        return finalOptions.get(value, defaultValue);
      } else {
        return finalOptions[value] || defaultValue;
      }
    }
    return undefined;
  },
};

function setDefaults(overrides) {
  Object.keys(overrides).forEach((key) => {
    if (typeof overrides[key] === 'object') {
      _defaultsValues[key] = {
        ..._defaultsValues[key],
        ...overrides[key],
      };
    } else {
      _defaultsValues[key] = overrides[key];
    }
  });
}
const getDefaults = () => _defaultsValues;
const getFormatters = () => formatters;
const setFormatters = (newFormatters) => {
  formatters = {
    ...formatters,
    ...newFormatters,
  };
};
export { formatters, setDefaults, getDefaults, getFormatters, setFormatters, config };
