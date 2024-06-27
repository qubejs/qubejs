import { utils } from '@qubejs/core';
import accent from './accent-colors';
import _string from './string';
import * as translate from './translate';
const object = utils.object;

export default function (processor: any) {
  processor.add('i18n', {
    translate: (value) => {
      return translate.translate(value);
    },
  });
  processor.add('common', {
    accentByChar: (value) => {
      return accent.getColorByChar(_string.getTwoChars(value));
    },
    getTwoChars: (value) => {
      return _string.getTwoChars(value);
    },
    addClassName: (value, { oldValue = '' } = {}) => {
      return oldValue + ' ' + value;
    },
    join: (value, { fields }, options = {}) => {
      const { userData }: any = options;
      const arr = fields?.split('+');
      const values = arr
        ?.map((val) => {
          val = val.trim().replace(new RegExp('&nbsp;', 'g'), ' ');
          if (val.charAt(0) === '.') {
            return object.getDataFromKey(userData, val.substr(1), undefined, options);
          }
          return val;
        })
        .join('');
      return values;
    },
  });
}
