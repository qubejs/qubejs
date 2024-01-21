import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useId } from '../../hooks';
import './_radio.scss';

const RadioField = ({ disabled, doFocus, name, options = [], defaultValue = '', className = '', value = '', label = '', onChange, errorMessage, display = 'Column', valueField = 'value', textField = 'text' }) => {
  const handleChange = (input) => {
    onChange && onChange({
      value: input.target.value
    });
  };
  const identifier = useId();
  const [focusDone, setFocusDone] = useState();
  const inputEl = useRef();
  useEffect(() => {
    if (doFocus && !focusDone) {
      setTimeout(() => {
        inputEl.current.focus();
    }, 100);
      setFocusDone(true);
    }
  }, [doFocus]);

  return <div className={`sq-radio ${className}`}>
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup aria-label={name} aria-describedby={identifier} name={name} className={`sq-radio__display-${display}`} value={value || defaultValue} onChange={handleChange}>
        {options && options.map((option, index) => {
          return <FormControlLabel key={index} value={option[valueField]} disabled={disabled || option.disabled} control={<Radio inputRef={index === 0 ? inputEl : undefined} />} label={option[textField]} />;
        })}
      </RadioGroup>
      {<div id={identifier} className="sq-error sq-select-field--error">{errorMessage}</div>}
    </FormControl>
  </div>;
};

RadioField.propTypes = {
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  valueField: PropTypes.string,
  textField: PropTypes.string,
  display: PropTypes.string,
  classes: PropTypes.object,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default RadioField;