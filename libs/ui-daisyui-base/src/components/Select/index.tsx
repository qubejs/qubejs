import React from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import { utils } from '@qubejs/web-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../daisy/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../daisy/ui/dropdown-menu';
import { Field } from '../../daisy/ui/field';
import { Label } from '../../daisy/ui/label';
import { cn } from '../../daisy/lib/utils';
import Icon from '../Icon';

const { translate } = utils.translate;
const common = utils.common;
const { getValue, idFromLabel } = utils.properties;

// Radix Select only accepts non-empty string values, so options are keyed by index.
const DEFAULT_KEY = '__default__';

const SQSelect = ({
  row,
  name,
  size,
  options = [],
  className = '',
  value = null,
  label = '',
  defaultText = '',
  defaultValue = '',
  onChange,
  onAnalytics,
  inputVariant = 'outlined',
  analytics,
  textField = 'text',
  valueField = 'value',
  iconField = 'iconName',
  iconColor = 'iconColor',
  checkbox = false,
  onAction,
  errorMessage,
  multiple,
  disabled,
  ...rest
}: any) => {
  const finalOptions = getValue(this, options, row) || [];
  const optionList = Array.isArray(finalOptions) ? finalOptions : [];
  const generatedId = React.useId();
  const triggerId = name || generatedId;
  const emit = (newValue) => {
    onChange &&
      onChange({
        value: newValue,
        options: finalOptions,
      });
  };
  const isValid =
    filter(optionList, { [valueField]: value }).length > 0 || value === '';
  const testId = idFromLabel(label);
  const renderOptionLabel = (option) => (
    <>
      {option[iconField] && (
        <Icon
          name={option[iconField]}
          size="small"
          variant={disabled ? 'default' : option[iconColor]}
        />
      )}
      {option[textField]}
    </>
  );
  const triggerClass = cn(
    'sq-select-field__input w-full',
    inputVariant === 'standard' && 'dy-select-ghost',
    size === 'small' && 'dy-select-sm'
  );

  let control;
  if (multiple) {
    const selected = !common.isNullOrUndefined(value) && Array.isArray(value) ? value : [];
    const toggle = (optionValue, isChecked) =>
      emit(
        isChecked
          ? [...selected, optionValue]
          : selected.filter((v) => v !== optionValue)
      );
    const selectedText = optionList
      .filter((o) => selected.indexOf(o[valueField]) > -1)
      .map((o) => o[textField])
      .join(', ');
    control = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            id={triggerId}
            data-part="select-trigger"
            data-testid={testId}
            aria-invalid={!!errorMessage || undefined}
            className={cn('dy-select w-full items-center text-left', triggerClass)}
          >
            <span className={cn('truncate', !selectedText && 'text-muted-foreground')}>
              {selectedText || translate(defaultText)}
            </span>
            
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="sq-select-field__pop-over min-w-56">
          {optionList.map((option, key) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={selected.indexOf(option[valueField]) > -1}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(isChecked) => toggle(option[valueField], isChecked)}
            >
              {renderOptionLabel(option)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    const selectedIndex = isValid
      ? optionList.findIndex((o) => o[valueField] === value)
      : -1;
    const selectedKey =
      selectedIndex > -1
        ? String(selectedIndex)
        : defaultText && (value === defaultValue || value === '' || value === null)
        ? DEFAULT_KEY
        : undefined;
    control = (
      <Select
        name={name}
        disabled={disabled}
        value={selectedKey ?? ''}
        onValueChange={(key) =>
          emit(key === DEFAULT_KEY ? defaultValue : optionList[Number(key)]?.[valueField])
        }
      >
        <SelectTrigger
          id={triggerId}
          data-testid={testId}
          aria-invalid={!!errorMessage || undefined}
          className={triggerClass}
          {...(rest['aria-label'] ? { 'aria-label': rest['aria-label'] } : {})}
        >
          <SelectValue placeholder={translate(defaultText) || ' '} />
        </SelectTrigger>
        <SelectContent className="sq-select-field__pop-over" position="popper">
          {!!defaultText && (
            <SelectItem value={DEFAULT_KEY}>{translate(defaultText)}</SelectItem>
          )}
          {optionList.map((option, key) => (
            <SelectItem key={key} value={String(key)} disabled={option.disabled}>
              {renderOptionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`sq-select-field ${className}`}>
      <Field className="sq-select-field-form-wrap gap-1.5">
        {label && <Label htmlFor={triggerId}>{label}</Label>}
        {control}
        {errorMessage && (
          <div className="sq-error sq-select-field--error">{errorMessage}</div>
        )}
      </Field>
    </div>
  );
};

SQSelect.propTypes = {
  name: PropTypes.string,
  defaultText: PropTypes.string,
  errorMessage: PropTypes.string,
  defaultValue: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  row: PropTypes.object,
  className: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  value: PropTypes.string,
  textField: PropTypes.string,
  valueField: PropTypes.string,
  onChange: PropTypes.func,
};

export default SQSelect;
