const commons = {
  isNullOrUndefined: (value) => {
    return value === undefined || value === null;
  },
  isNullOrUndefinedBlank: (value) => {
    return commons.isNullOrUndefined(value) || value === '';
  },
  idFromLabel: (value) => {
    let textId = value?.toString() || 'unnamed';
    textId = textId.toLowerCase().replace(new RegExp(' ', 'g'), '_');
    return textId;
  },
  getValue: (context, value?, ...args) => {
    if (typeof value === 'function') {
      return value.apply(context, args);
    }
    return value || '';
  },
  toStringBlank: (val) => {
    return !commons.isNullOrUndefined(val) ? val : '';
  },
};

export default commons;
