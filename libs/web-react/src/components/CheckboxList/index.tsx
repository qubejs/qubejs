import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import CheckboxField from '../Checkbox';
import './_checkbox-list.scss';

const CheckboxList = ({
  name,
  options = [],
  className = '',
  disabled = false,
  info = '',
  value = [],
  label = '',
  labelField = 'label',
  textField = 'text',
  valueField = 'value',
  onChange,
  errorMessage,
}:any) => {

  const handleChange = (input, item) => {
    let finalValue;
    if (input.checked) {
      finalValue = [...value, item[valueField]];
    } else {
      const cloneVals = value.slice();
      cloneVals.splice(cloneVals.indexOf(item[valueField]), 1);
      finalValue = [...cloneVals];
    }
    onChange &&
      onChange({
        value: finalValue,
      });
  };
  return (
    <div className={`sq-checkbox-list ${className}`}>
      <FormControl component="fieldset">
        {label && <FormLabel component="legend">{label}</FormLabel>}
        <FormGroup>
          {options.map((option, index) => {
            return (
              <CheckboxField
                key={index}
                name={name}
                disabled={disabled}
                checked={value.indexOf(option[valueField]) > -1}
                text={option[textField]}
                label={option[labelField]}
                onChange={(val, e) => handleChange(val, option)}
              />
            );
          })}
        </FormGroup>
        {info && <FormHelperText>{info}</FormHelperText>}
        {<div className="sq-error sq-checkbox-list--error">{errorMessage}</div>}
      </FormControl>
    </div>
  );
};

CheckboxList.propTypes = {
  name: PropTypes.string,
  defaultText: PropTypes.string,
  label: PropTypes.string,
  info: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default CheckboxList;