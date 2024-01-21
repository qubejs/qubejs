import object from './object';

const SpecialValidators = function (validator) {
  validator.addValidator(
    'equals',
    (value, { subType = '=', matchValue, fieldName }, otherFields) => {
      const finalValue = fieldName
        ? object.getDataFromKey(otherFields, fieldName)
        : value;
      if (subType === '=') {
        return finalValue === matchValue;
      } else if (subType === 'bool') {
        return Boolean(finalValue) === Boolean(matchValue);
      } else if (subType === '!=') {
        return finalValue !== matchValue;
      }
      return true;
    }
  );
};

export default SpecialValidators;
