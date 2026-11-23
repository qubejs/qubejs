import { useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '../../daisy/compat/autocomplete';
import './auto-complete.scss';

const SQAutocompleteValue = ({ row, name, options = [], fixedOptions = [], className = '', optionsValue,  inputClassName = '', value, label = '', onChange, onAnalytics, inputVariant = 'outlined', analytics, defaultValue = '', textField = 'text', valueField = 'value', errorMessage, compProps = {}, maxLimit, ...rest }) => {
  let initialValues;
  if (value && typeof value === 'string') {
    initialValues = value.split(',');
  } else {
    initialValues = [];
  }
  let newValues = optionsValue?.map(i => i[textField]) || [] ;

  const [values, setValues] = useState(Array.isArray(value) ? value : initialValues || []);

  const handleChange = (e, value) => {
    setValues(value);
    onChange && onChange({ value: value });
  };

  const handleKeyUp = (e) => {
    if (e.keyCode == 13) {
      if (maxLimit && value?.length >= maxLimit) {
        return;
      }
      e.preventDefault();
      if (!e.target.value) {
        return;
      }
      setValues([...values, e.target.value]);
      onChange && onChange({ value: [...values, e.target.value] });
      setInputValue('');
    }
  };

  const [inputValue, setInputValue] = useState('');
  return (
    <div className={`sq-autocomplete-value ${className}`}>
      <Autocomplete
        multiple={true}
        freeSolo={true}
        label={label}
        placeholder={compProps.placeholder}
        disabled={compProps.disabled}
        inputClassName={inputClassName}
        options={newValues}
        inputValue={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyUp}
        getOptionLabel={(option) => (rest.getOptionLabel ? rest.getOptionLabel(option) : option)}
        renderTag={(option) => <span className="sq-autocomplete__chip flb-d flb-a-center">{option}</span>}
        value={values}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
      />
    </div>
  );
};

SQAutocompleteValue.propTypes = {
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  row: PropTypes.object,
  className: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  textField: PropTypes.string,
  valueField: PropTypes.string,
  onChange: PropTypes.func,
  fixedOptions: PropTypes.array,
  inputClassName: PropTypes.string,
  inputVariant: PropTypes.string,
  defaultValue: PropTypes.string,
  compProps: PropTypes.object,
  onAnalytics: PropTypes.string,
  analytics: PropTypes.string,
  maxLimit: PropTypes.number,
  optionsValue: PropTypes.array,
};

export default SQAutocompleteValue;
