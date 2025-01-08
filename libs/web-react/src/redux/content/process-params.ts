import * as utils from '../../utils';
const { object, common, processor, validator } = utils;
const { Validator } = validator;

export const processEachParam = (userData, key, defaultValue, state) => {
  let value;
  if (key && key.toString().substr(0, 2) === '::') {
    const moduleName = key.toString().split('::');
    const passedKey = key
      .substr(key.toString().lastIndexOf('::') + 2, key.length - 4)
      .trim();
    const parsedModule = processor.parseCustomModule(moduleName[1]);
    if (passedKey.substr(0, 1) === '.') {
      value = object.getDataFromKey(
        userData,
        passedKey.substr(1),
        defaultValue
      );
    } else {
      value = passedKey;
    }
    if (parsedModule) {
      value = processor.execute(
        parsedModule.module,
        value,
        parsedModule.params,
        { state, userData }
      );
    }
  } else if (key && key.toString().substr(0, 1) === '.') {
    value = object.getDataFromKey(userData, key.substr(1), defaultValue);
  } else if (!common.isNullOrUndefined(key)) {
    value = key;
  }
  return value;
};
export const processParams = (
  userData,
  params = {},
  defaultValue = null,
  state?
): any => {
  let newObj: any = {};
  Object.keys(params).forEach((key) => {
    let value;
    if (
      typeof params[key] === 'object' &&
      params[key] !== null &&
      params[key].match
    ) {
      const validator = new Validator(params[key].match);
      validator.setValues(userData);
      value = validator.validateAll();
    } else if (
      typeof params[key] === 'object' &&
      params[key] !== null &&
      !Array.isArray(params[key])
    ) {
      value = processParams(userData, params[key], defaultValue, state);
    } else {
      value = processEachParam(userData, params[key], defaultValue, state);
    }
    if (
      key.startsWith('...') &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      newObj = { ...newObj, ...value };
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
};
