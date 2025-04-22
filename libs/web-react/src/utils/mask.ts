import { utils } from '@qubejs/core';
import { getSign, get } from './currency';
const { getFormatters } = utils.format;
const { isNullOrUndefined } = utils.common;

const masks = {
  currency: {
    mask: (value, options = {}) => {
      return getFormatters().currency(value, { sign: getSign(), currency: get(), input: true, decimals: 2, ...options });
    },
    unmask: (value, options = {}) => {
      return value && value.toString().replace(/[^0-9.-]/g, '');
    },
  },
  appendViewOnlyText: {
    mask: (value, { appendAt = 'start', text = '' } = {}) => {
      return value.indexOf(text) === -1 ? (appendAt === 'start' ? text : '') + `${value || ''}` + (appendAt === 'end' ? text : '') : value;
    },
    unmask: (value, { text = '' } = {}) => {
      return value.replace(text, '');
    },
  },
  titleCase: {
    mask: (value, { input = false }) => {
      const allArr = value.split(' ');
      for (let i = 0; i < allArr.length; i++) {
        allArr[i] = (allArr[i][0] || '')?.toUpperCase() + (allArr[i] || '')?.substr(1);
      }
      return allArr.join(' ');
    },
    unmask: (value) => {
      return value;
    },
  },
  upperCase: {
    mask: (value, { input = false }) => {
      return value?.toString().toUpperCase();
    },
    unmask: (value) => {
      return value;
    },
  },
  lowerCase: {
    mask: (value, { input = false }) => {
      return value?.toString().toLowerCase();
    },
    unmask: (value) => {
      return value;
    },
  },
  appendText: {
    mask: (value, { appendAt = 'start', text = '' } = {}) => {
      return value.indexOf(text) === -1 ? (appendAt === 'start' ? text : '') + `${value || ''}` + (appendAt === 'end' ? text : '') : value;
    },
    unmask: (value, { text = '' } = {}) => {
      return value;
    },
  },
  number: {
    mask: (value, { pattern = '', param = 'D' } = {}) => {
      let out = '';
      if (pattern) {
        const allValues = pattern.split('');
        const valueArra = value.toString().split('');
        let idx = 0;

        allValues.forEach((digit) => {
          if (digit === param) {
            out += valueArra[idx] || '';
            idx++;
          } else if (idx < valueArra.length) {
            out += digit;
          }
        });
      }
      return out;
    },
    unmask: (value, { pattern = '', param = 'D' } = {}) => {
      return value && value.toString().replace(/[^0-9.]/g, '').substr(0, pattern.replace(new RegExp(`[^${param}]`, 'g'), '').length);
    },
  },
  phone: {
    mask: (value) => {
      value = isNullOrUndefined(value) ? '' : value.toString();
      const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      if (!x) {
        return value;
      }
      return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    },
    unmask: (value) => {
      return (
        value &&
        value
          .toString()
          .replace(/[^0-9]/g, '')
          .substr(0, 10)
      );
    },
  },
  INphone: {
    mask: (value) => {
      value = isNullOrUndefined(value) ? '' : value.toString();
      const x = value.replace(/\D/g, '').match(/(\d{0,4})(\d{0,6})/);
      if (!x) {
        return value;
      }
      return `${!x[2] ? x[1] : + x[1] + ' - ' + x[2]}`;
    },
    unmask: (value) => {
      return (
        value &&
        value
          .toString()
          .replace(/[^0-9]/g, '')
          .substr(0, 10)
      );
    },
  },
  percentage: {
    mask: (value, { input = false } = {}) => {
      if (!input) {
        return value + '%';
      } else {
        return value;
      }
    },
    unmask: (value) => {
      return value && value.toString().replace(/[^0-9.-]/g, '');
    },
  },
};

export const getMasks = () => masks;

export const addMask = (name, obj) => {
  masks[name] = obj;
};

export { masks };
