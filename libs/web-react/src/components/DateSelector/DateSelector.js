import { useState } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import TextField from '@mui/material/TextField';
import { getValue } from '../../utils/properties';
import { datetime } from '../../utils/datetime';

const instanceTypes = {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DesktopDatePicker,
  MobileDatePicker,
};

const instanceDefaultValues = {
  DatePicker: {
    inputFormat: 'MM/dd/yyyy',
    outputFormat: 'MM/DD/YYYY',
    mask: '__/__/____',
  },
  DateTimePicker: {
    inputFormat: 'MM/dd/yyyy HH:mm',
    outputFormat: 'MM/DD/YYYY HH:mm',
    mask: '__/__/____ __:__',
  },
  TimePicker: {
    inputFormat: 'HH:mm',
    outputFormat: 'HH:mm',
    mask: '__:__',
  },
};

const DateSelector = ({ value, label = '', disabled, readOnly, helperText, inputVariant = 'outlined', className = '', valueFormat, minDate, maxDate, onChange, error, errorMessage, instanceType = 'DatePicker', row, ...rest }) => {
  const isValid = value ? moment(value).isValid() : false;
  const valueDate = isValid ? moment(value)._d : value;
  const [focus, setFocus] = useState(false);
  const { inputFormat = 'MM/dd/yyyy', outputFormat = 'MM/DD/YYYY', mask = '__/__/____' } = instanceDefaultValues[instanceType] || rest;
  const handleonSelect = (date, input) => {
    if (!input && date && moment(date).isValid()) {
      const text = moment(date).format(outputFormat);
      onChange &&
        onChange({
          value: !valueFormat ? moment(date).toISOString() : moment(date).format(valueFormat),
          text,
        });
    } else if (input) {
      const valueToPass = moment(input, outputFormat, true).isValid() ? (!valueFormat ? moment(input).toISOString() : moment(input).format(valueFormat)) : null;
      onChange &&
        onChange({
          value: valueToPass,
          text: input,
        });
    } else {
      onChange &&
        onChange({
          value: undefined,
          text: '',
        });
    }
  };
  const handleOnFocus = () => {
    setFocus(true);
  };
  const handleOnBlur = () => {
    setFocus(false);
  };

  const finalMinDate = getValue(this, minDate, row);
  const finalMaxDate = getValue(this, maxDate, row);

  const extraProps = {};
  if (finalMinDate) {
    extraProps.minDate = typeof finalMinDate === 'string' ? datetime.new(finalMinDate)._date._d : finalMinDate;
  }
  if (finalMaxDate) {
    extraProps.maxDate = typeof finalMaxDate === 'string' ? datetime.new(finalMaxDate)._date._d : finalMaxDate;
  }
  const DatePickerInstance = instanceTypes[instanceType];
  return (
    <div className={`sq-date-selector ${className}`}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePickerInstance
          {...rest}
          inputFormat={inputFormat}
          disabled={disabled}
          {...extraProps}
          PopperProps={{
            className: 'sq-date-selector__dialog',
          }}
          DialogProps={{
            classes: {
              root: 'sq-date-selector__dialog',
            },
          }}
          mask={mask}
          value={isValid ? valueDate || null : null}
          renderInput={(props) => (
            <TextField
              {...props}
              label={label}
              error={error}
              variant={inputVariant}
              readOnly={readOnly}
              helperText={helperText}
            />
          )}
          onChange={handleonSelect}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </LocalizationProvider>
      {!focus && errorMessage && <div className="sq-error">{errorMessage}</div>}
    </div>
  );
};

DateSelector.propTypes = {};
export default DateSelector;
