import React from 'react';
import PropTypes from 'prop-types';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { utils } from '@qubejs/web-react';

import './_checkbox-list.scss';

const common = utils.common;

const CheckboxField = ({
  name,
  className = '',
  defaultValue = '',
  selectedValue = 'on',
  disabled = false,
  value = '',
  checked = false,
  label = '',
  text = '',
  onClick,
  onChange,
  errorMessage,
  analytics = {},
  onAnalytics,
  ...rest
}:any) => {
  const stateChecked  = checked || selectedValue === value;
  const {
    click: anlayticClick,
    checked: anlayticChecked,
    unchecked: analyticUnChcked,
  }:any = analytics;
  const handleChange = (input) => {
    !disabled && anlayticClick && onAnalytics && onAnalytics(anlayticClick);
    if (input.target.checked) {
      !disabled &&
        onChange &&
        onChange(
          {
            checked: true,
            value: selectedValue,
          },
          input
        );
      !disabled &&
        anlayticChecked &&
        onAnalytics &&
        onAnalytics(anlayticChecked);
    } else {
      !disabled &&
        onChange &&
        onChange(
          {
            checked: false,
            value: common.isNullOrUndefined(defaultValue) ? '' : defaultValue,
          },
          input
        );
      !disabled &&
        analyticUnChcked &&
        onAnalytics &&
        onAnalytics(analyticUnChcked);
    }
  };
  return (
    <div className={`sq-checkbox-field ${className}`}>
      <FormControl component="fieldset" error={rest.error}>
        {label && <FormLabel component="legend">{label}</FormLabel>}
        <FormControlLabel
          control={
            <Checkbox
              disabled={disabled}
              checked={stateChecked}
              onClick={onClick}
              onChange={handleChange}
              name={name}
            />
          }
          label={text}
        />
      </FormControl>
      {errorMessage && <div className="sq-error sq-checkbox-list--error">{errorMessage}</div>}
    </div>
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  text: PropTypes.string,
  selectedValue: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};


export default CheckboxField;
