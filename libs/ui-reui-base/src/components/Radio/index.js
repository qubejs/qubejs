import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { hooks } from '@qubejs/web-react';
import { RadioGroup, RadioGroupItem } from '../../reui/ui/radio-group';
import { Field, FieldLabel, FieldLegend, FieldSet } from '../../reui/ui/field';
import './_radio.scss';
const { useId } = hooks;

const RadioField = ({
  disabled,
  doFocus,
  name,
  options = [],
  defaultValue = '',
  className = '',
  value = '',
  label = '',
  onChange,
  errorMessage,
  display = 'Column',
  valueField = 'value',
  textField = 'text',
}) => {
  const handleChange = (newValue) => {
    onChange &&
      onChange({
        value: newValue,
      });
  };
  const identifier = useId();
  const [focusDone, setFocusDone] = useState();
  const inputEl = useRef();
  useEffect(() => {
    if (doFocus && !focusDone) {
      setTimeout(() => {
        inputEl.current && inputEl.current.focus();
      }, 100);
      setFocusDone(true);
    }
  }, [doFocus]);

  return (
    <div className={`sq-radio ${className}`}>
      <FieldSet className="gap-2">
        {label && (
          <FieldLegend variant="label" className="mb-1">
            {label}
          </FieldLegend>
        )}
        <RadioGroup
          aria-label={name}
          aria-describedby={identifier}
          name={name}
          className={`sq-radio__display-${display} ${
            display === 'Row' ? 'flex flex-row flex-wrap gap-4' : ''
          }`}
          value={`${value || defaultValue}`}
          onValueChange={handleChange}
        >
          {options &&
            options.map((option, index) => {
              const optionId = `${identifier}_${index}`;
              return (
                <Field key={index} orientation="horizontal" className="w-auto items-center">
                  <RadioGroupItem
                    id={optionId}
                    value={`${option[valueField]}`}
                    disabled={disabled || option.disabled}
                    ref={index === 0 ? inputEl : undefined}
                  />
                  <FieldLabel htmlFor={optionId} className="font-normal">
                    {option[textField]}
                  </FieldLabel>
                </Field>
              );
            })}
        </RadioGroup>
        <div id={identifier} className="sq-error sq-select-field--error">
          {errorMessage}
        </div>
      </FieldSet>
    </div>
  );
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
  onChange: PropTypes.func,
};

export default RadioField;
