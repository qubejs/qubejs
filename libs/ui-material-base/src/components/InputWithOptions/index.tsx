import PropTypes from 'prop-types';
import Input from '../Input';
import CheckboxList from '../CheckboxList';
import Autocomplete from '../Autocomplete';

const map = {
  CheckboxList,
  Autocomplete
};

const InputWithOptions = ({
  optionsLabel,
  optionCmpType = 'CheckboxList',
  label,
  value,
  className = '',
  options = [],
  onChange,
}: any) => {
  const handleCheckChange = (data) => {
    let existing = value || '';
    options.forEach((item) => {
      if (existing.indexOf(item.value) > -1) {
        existing = existing.replace(item.value, '');
      }
    });
    data.value.forEach((item) => {
      if (existing.indexOf(item) === -1) {
        existing = existing + ' ' + item;
      }
    });
    onChange &&
      onChange({
        value: existing
          .split(' ')
          .filter((i) => !!i)
          .join(' '),
      });
  };
  const handleInputChange = (data) => {
    onChange && onChange(data);
  };
  const CompToRender = map[optionCmpType];
  return (
    <div className={`sq-input-with-options ${className}`}>
      <CompToRender
        label={optionsLabel}
        options={options}
        className={'mb-wide'}
        multiple={true}
        value={value?.split(' ')}
        onChange={handleCheckChange}
      />
      <Input label={label} value={value} onChange={handleInputChange} />
    </div>
  );
};
InputWithOptions.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default InputWithOptions;
