import common from './common';

const string = {
  titleCase: (val) => {
    return !common.isNullOrUndefined(val?.trim()) && typeof val === 'string' ? (val.trim()[0].toUpperCase() + val.trim().substr(1).toLowerCase()) : '';
  },
  getFirstChar: (val) => {
    return !common.isNullOrUndefined(val) && typeof val === 'string' ? val.trim()[0] : '';
  },
  getTwoChars: (val) => {
    if (!common.isNullOrUndefined(val) && typeof val === 'string') {
      const array = val.split(' ').filter((i) => !!i);
      return ((array[0] && array[0][0]) || '') + ((array[1] && array[1][0]) || '');
    }
    return '';
  },
};
export default string;
