import common from './common';
import { getFormatters } from './format';
import { Validator } from './validator';

const _object = {
  clone: function (obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  extendData: (org = {}, update = {}) => {
    const obj = {
      ...org,
    };
    Object.keys(update).forEach((a) => {
      if (
        !Array.isArray(update[a]) &&
        typeof update[a] === 'object' &&
        update[a] !== null
      ) {
        obj[a] = _object.extendData(obj[a], update[a]);
      } else if (Array.isArray(update[a])) {
        obj[a] = update[a].slice();
      } else {
        obj[a] = update[a];
      }
    });
    return obj;
  },
  getDataFromKey: function (data = {}, key, defaultValue: any = '') {
    if (!common.isNullOrUndefined(data[key])) {
      return data[key];
    }
    const allItems = typeof key === 'string' ? key.split('.') : [];
    let value =
      typeof key === 'string' && allItems.length > 0
        ? data
        : typeof key === 'object'
        ? key
        : defaultValue;
    allItems.forEach((nestedKey) => {
      value =
        !common.isNullOrUndefined(value) &&
        !common.isNullOrUndefined(value[nestedKey])
          ? value[nestedKey]
          : defaultValue;
    });
    return value;
  },
  processBlock: function (block, options: any = {}) {
    const { userData } = options;
    !common.isNullOrUndefined(block) &&
      Object.keys(block).forEach((keyForBlock) => {
        if (Array.isArray(block[keyForBlock])) {
          block[keyForBlock].forEach((item) => {
            _object.processBlock(item, { userData });
          });
        } else if (
          typeof block[keyForBlock] === 'object' &&
          !common.isNullOrUndefined(block[keyForBlock])
        ) {
          const item = block[keyForBlock];
          _object.processBlock(item, { userData });
        }
      });
    if (block?.inject) {
      Object.keys(block.inject).forEach((key) => {
        const keyDynoData = _object.getDataFromKey(userData, key);
        if (
          typeof block.inject[key] === 'object' &&
          block.inject[key] !== null &&
          block.inject[key].match
        ) {
          const _valid = new Validator({
            ...block.inject[key].match,
          });
          _valid.setValues({ ...userData, [key]: keyDynoData });
          block[key] = _valid.validateAll();
        } else {
          block[key] = _object.getDataFromKey(
            { ...userData, [key]: keyDynoData },
            block.inject[key]
          );
        }
      });
    }
    return block;
  },
  processMessage: (html, data = {}, options: any = {}) => {
    const { removePrefix = '' } = options;
    const allFormatters = getFormatters();
    const dataToProcess = data;
    if (html && typeof html === 'string') {
      const arrayKeys = html.match(/##([^(##)])*##/g);
      arrayKeys &&
        arrayKeys.forEach((key) => {
          let exactKey = key.replace(/##/g, '').replace(removePrefix, '');
          let fnToCall;
          if (exactKey.indexOf('|') > -1) {
            fnToCall = exactKey.substr(0, exactKey.indexOf('|'));
            exactKey = exactKey.substr(exactKey.indexOf('|') + 1);
          }
          const textOutput =
            typeof dataToProcess[exactKey] === 'function'
              ? dataToProcess[exactKey](data)
              : _object.getDataFromKey(dataToProcess, exactKey);
          let value = _object.processMessage(textOutput, data, options);
          if (fnToCall && allFormatters[fnToCall]) {
            value = allFormatters[fnToCall](value);
          }
          html = html.replace(new RegExp(key.replace('|', '\\|'), 'g'), value);
        });
    }
    return common.isNullOrUndefined(html) ? '' : html;
  },
};

export default _object;
