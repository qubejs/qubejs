import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import { Checkbox } from '../../daisy/ui/checkbox';
import { Field, FieldLabel, FieldLegend, FieldSet } from '../../daisy/ui/field';

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
  const stateChecked = checked || selectedValue === value;
  const checkboxId = React.useId();
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
      <FieldSet data-invalid={rest.error || undefined} className="gap-2">
        {label && (
          <FieldLegend variant="label" className="mb-1">
            {label}
          </FieldLegend>
        )}
        <Field orientation="horizontal" className="w-auto items-center">
          <Checkbox
            id={checkboxId}
            disabled={disabled}
            checked={stateChecked}
            onClick={onClick}
            onCheckedChange={(isChecked) =>
              handleChange({ target: { checked: isChecked === true, name } })
            }
            name={name}
          />
          {text && (
            <FieldLabel htmlFor={checkboxId} className="font-normal">
              {text}
            </FieldLabel>
          )}
        </Field>
      </FieldSet>
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
