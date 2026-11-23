import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { CalendarIcon } from 'lucide-react';
import { utils } from '@qubejs/web-react';
import TextField from '../../daisy/compat/text-field';
import { Button } from '../../daisy/ui/button';
import { Calendar } from '../../daisy/ui/calendar';
import { Input } from '../../daisy/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../daisy/ui/popover';

const { getValue } = utils.properties;
const { datetime } = utils.datetime;

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
// MUI's Desktop/Mobile variants behave like DatePicker here
instanceDefaultValues.DesktopDatePicker = instanceDefaultValues.DatePicker;
instanceDefaultValues.MobileDatePicker = instanceDefaultValues.DatePicker;

const DateSelector = ({ value, label = '', disabled, readOnly, helperText, inputVariant = 'outlined', className = '', valueFormat, minDate, maxDate, onChange, error, errorMessage, instanceType = 'DatePicker', row, ...rest }) => {
  const isValid = value ? moment(value).isValid() : false;
  const valueDate = isValid ? moment(value)._d : undefined;
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const { outputFormat = 'MM/DD/YYYY' } = instanceDefaultValues[instanceType] || rest;
  const hasDate = instanceType !== 'TimePicker';
  const hasTime = instanceType === 'DateTimePicker' || instanceType === 'TimePicker';
  const formatted = isValid ? moment(value).format(outputFormat) : '';
  const [text, setText] = useState(formatted);

  useEffect(() => {
    if (!focus) setText(formatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formatted]);

  const handleonSelect = (date, input) => {
    if (!input && date && moment(date).isValid()) {
      const text = moment(date).format(outputFormat);
      onChange &&
        onChange({
          value: !valueFormat ? moment(date).toISOString() : moment(date).format(valueFormat),
          text,
        });
    } else if (input) {
      const parsed = moment(input, outputFormat, true);
      const valueToPass = parsed.isValid() ? (!valueFormat ? parsed.toISOString() : parsed.format(valueFormat)) : null;
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
    if (text !== formatted) handleonSelect(null, text);
  };

  const finalMinDate = getValue(this, minDate, row);
  const finalMaxDate = getValue(this, maxDate, row);
  const toDate = (d) => (typeof d === 'string' ? datetime.new(d)._date._d : d);
  const min = finalMinDate ? toDate(finalMinDate) : undefined;
  const max = finalMaxDate ? toDate(finalMaxDate) : undefined;
  const disabledDays = [min && { before: min }, max && { after: max }].filter(Boolean);

  const pickDate = (day) => {
    if (!day) return;
    const next = moment(day);
    if (hasTime && valueDate) {
      next.hours(valueDate.getHours()).minutes(valueDate.getMinutes());
    }
    handleonSelect(next.toDate());
    if (!hasTime) setOpen(false);
  };
  const pickTime = (hhmm) => {
    const [h, m] = (hhmm || '').split(':').map(Number);
    if (Number.isNaN(h)) return;
    const base = moment(valueDate || new Date());
    handleonSelect(base.hours(h).minutes(m || 0).seconds(0).toDate());
  };

  return (
    <div className={`sq-date-selector ${className}`}>
      <TextField
        label={label}
        error={error}
        disabled={disabled}
        helperText={helperText}
        placeholder={outputFormat}
        value={text}
        InputProps={{
          readOnly,
          endAdornment: (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={disabled || readOnly}
                  aria-label={hasDate ? 'Choose date' : 'Choose time'}
                >
                  <CalendarIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="sq-date-selector__dialog w-auto p-0">
                {hasDate && (
                  <Calendar
                    mode="single"
                    selected={valueDate}
                    defaultMonth={valueDate}
                    onSelect={pickDate}
                    disabled={disabledDays}
                    startMonth={min}
                    endMonth={max}
                  />
                )}
                {hasTime && (
                  <div className="flex items-center gap-2 border-t p-3">
                    <Input
                      type="time"
                      aria-label="Time"
                      value={valueDate ? moment(valueDate).format('HH:mm') : ''}
                      onChange={(e) => pickTime(e.target.value)}
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
          ),
        }}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleonSelect(null, text);
        }}
      />
      {!focus && errorMessage && <div className="sq-error">{errorMessage}</div>}
    </div>
  );
};

DateSelector.propTypes = {};
export default DateSelector;
