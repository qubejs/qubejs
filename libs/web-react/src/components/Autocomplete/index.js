import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import Icon from '../Icon';
import { getValue } from '../../utils/properties';
import { useId } from '../../hooks';
const SQAutocomplete = ({
  row,
  name,
  options = [],
  freeSolo,
  preserveValues = false,
  fixedOptions = [],
  allowFreeText = false,
  className = '',
  disabled,
  inputClassName = '',
  value = null,
  label = '',
  onChange,
  onAnalytics,
  doFocus,
  inputVariant = 'outlined',
  analytics,
  defaultValue = '',
  textField = 'text',
  valueField = 'value',
  multiple,
  onAction,
  error,
  errorMessage,
  compProps = {},
  minTypeLength = 3,
  saveTextField,
  maxSelection,
  ...rest
}) => {
  const identifier = useId();
  const [inputValue, setInputValue] = useState('');
  const [currentValue, setCurrentValue] = useState(multiple ? [] : null);
  const [finalOptions, setFinalOptions] = useState([]);
  const [timer, setTimer] = useState(null);
  const handleChange = (e, _value) => {
    setCurrentValue(_value);
    let parkValue = _value;
    if (maxSelection && Array.isArray(parkValue) && parkValue.length > maxSelection) {
      parkValue = [..._value];
      parkValue.splice(0, 1);
    }
    setFocusDone(false);
    saveTextField &&
      onAction &&
      onAction(
        {},
        {
          actionType: 'user-store',
          params: { [saveTextField]: multiple ? [...fixedOptions.map((i) => i[textField]), ...parkValue.filter((option) => fixedOptions.indexOf(option) === -1).map((i) => i[textField])] : parkValue && parkValue[textField] },
        }
      );
    onChange &&
      onChange({
        value: multiple ? [...fixedOptions.map((i) => i[valueField]), ...parkValue.filter((option) => fixedOptions.indexOf(option) === -1).map((i) => i[valueField])] : parkValue && parkValue[valueField],
        options,
      });
  };

  const handleBlur = () => {
    setFocusDone(false);
    if (allowFreeText && inputValue) {
      onChange &&
        onChange({
          value: inputValue,
          options,
        });
    }
  };

  const [focusDone, setFocusDone] = useState();
  const inputEl = useRef();
  useEffect(() => {
    if (doFocus && !focusDone) {
      setTimeout(() => {
        inputEl.current.focus();
        setFocusDone(false);
      }, 100);
      setFocusDone(true);
    }
  }, [doFocus]);

  useEffect(() => {
    const output = getValue(this, options, row) || [];
    let finalOptions = [...output, ...(multiple && preserveValues ? (value ? value.filter((i) => !!i).map((i) => ({ [textField]: i, [valueField]: i })) : []) : [])];
    setFinalOptions(finalOptions);
  }, [value, options]);

  useEffect(() => {
    if (finalOptions) {
      let optionFound;
      if (!multiple) {
        optionFound = Array.isArray(finalOptions) && finalOptions.filter((i) => i[valueField] === value)[0];
      } else {
        optionFound = value
          ?.map((item) => {
            const found = Array.isArray(finalOptions) && finalOptions.filter((i) => i[valueField] === item)[0];
            return found;
          })
          .filter((i) => !!i);
      }
      setCurrentValue(optionFound || (multiple ? [] : null));
    }
  }, [finalOptions]);

  const finalFixedOptions = getValue(this, fixedOptions, row) || [];
  return (
    <div className={`sq-autocomplete ${className}`}>
      <Autocomplete
        id={`${identifier}_input`}
        disabled={disabled}
        {...compProps}
        classes={{
          popper: 'sq-autocomplete__pop-over',
        }}
        inputValue={inputValue}
        onBlur={handleBlur}
        freeSolo={freeSolo || multiple}
        forcePopupIcon={true}
        autoSelect={multiple}
        multiple={multiple}
        options={finalOptions}
        getOptionLabel={(option) => (rest.getOptionLabel ? rest.getOptionLabel(option) : option[textField] || '')}
        onChange={handleChange}
        filterOptions={rest.filterOptions}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={
                <div className="sq-autocomplete__chip d-fl fl-a-center ">
                  {option.iconName && <Icon size={'xs'} name={option.iconName} variant={option.iconColor} />}
                  {option[textField]}
                </div>
              }
              {...getTagProps({ index })}
              disabled={disabled || finalFixedOptions.indexOf(option) !== -1}
            />
          ))
        }
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.iconName && <Icon name={option.iconName} variant={option.iconColor} />}
            {rest.getOptionLabel ? rest.getOptionLabel(option) : option[textField]}
          </Box>
        )}
        value={currentValue}
        onInputChange={(event, newInputValue, reason, test) => {
          setInputValue(newInputValue);
          if (timer) {
            clearTimeout(timer);
            setTimer(null);
          }
          setTimer(setTimeout(() => {
            if (rest.typeAction && newInputValue?.length >= minTypeLength && onAction) {
              onAction(
                {},
                {
                  actionType: 'user-store',
                  params: { currentText: newInputValue },
                }
              );
              if (reason !== 'reset' && rest.typeAction && onAction) {
                onAction({ value: newInputValue }, rest.typeAction);
              }
            }
            setTimer(null);
          }, 400));
        }}
        renderInput={(params) => {
          return <TextField inputRef={inputEl} {...params} inputProps={{ ...params.inputProps, 'aria-describedby': identifier }} variant={inputVariant} error={error} className={inputClassName} label={label} />;
        }}
      />
      {errorMessage && (
        <div id={identifier} className="sq-error sq-autocomplete--error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

SQAutocomplete.propTypes = {
  name: PropTypes.string,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  row: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  textField: PropTypes.string,
  valueField: PropTypes.string,
  onChange: PropTypes.func,
};

export default SQAutocomplete;
