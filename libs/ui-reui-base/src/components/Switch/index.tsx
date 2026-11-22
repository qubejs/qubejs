import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import { Switch } from '../../reui/ui/switch';

const common = utils.common;

const SQSwitch = ({
  label,
  className = '',
  defaultValue = false,
  selectedValue = true,
  inline = true,
  value,
  color = 'primary',
  onChange,
  onAnalytics,
  analytics = {},
}:any) => {
  const checked = !(defaultValue === value) && value === selectedValue;
  const { change: changeAnalytics }:any = analytics;
  const handleChange = (evt) => {
    let valueToPass;
    if (evt.target.checked) {
      valueToPass = selectedValue;
    } else {
      if (!common.isNullOrUndefined(defaultValue)) {
        valueToPass = defaultValue;
      } else {
        valueToPass = evt.target.checked;
      }
    }
    onChange &&
      onChange({
        value: valueToPass,
      });
    onAnalytics && changeAnalytics && onAnalytics(changeAnalytics);
  };
  return (
    <div className={`sq-switch ${inline ? 'sq-switch--inline' : ''} ${className}`}>
      {label}
      <Switch
        checked={checked}
        onCheckedChange={(isChecked) => handleChange({ target: { checked: isChecked } })}
        aria-label={label}
        className={`sq-switch__control sq-switch--${color}`}
      />
    </div>
  );
};
SQSwitch.propTypes = {
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  row: PropTypes.object,
  tag: PropTypes.string,
  onChange: PropTypes.func,
  parentTag: PropTypes.string,
};

export default SQSwitch;
