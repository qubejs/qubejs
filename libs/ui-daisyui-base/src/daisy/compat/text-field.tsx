import * as React from 'react';
import { cn } from '../lib/utils';
import { pickDomProps } from './dom-props';
import { Field, FieldDescription } from '../ui/field';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from '../ui/input-group';

/**
 * daisyUI text field that accepts the subset of MUI <TextField> props used across qubejs
 * components (label, error, helperText, multiline, inputProps, InputProps adornments,
 * inputRef, ...). Rendered with daisyUI fieldset, label and input.
 */
export interface TextFieldProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  value?: any;
  defaultValue?: any;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  size?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  inputRef?: React.Ref<any>;
  inputProps?: Record<string, any>;
  InputProps?: {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    readOnly?: boolean;
    [key: string]: any;
  };
  onChange?: (e: React.ChangeEvent<any>) => void;
  onKeyPress?: (e: React.KeyboardEvent<any>) => void;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
  onKeyUp?: (e: React.KeyboardEvent<any>) => void;
  onFocus?: (e: React.FocusEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onClick?: (e: React.MouseEvent<any>) => void;
  [key: string]: any;
}

// MUI-only props that must not reach the DOM
const MUI_ONLY = [
  'variant',
  'fullWidth',
  'margin',
  'color',
  'InputLabelProps',
  'FormHelperTextProps',
  'SelectProps',
  'select',
  'focused',
  'hiddenLabel',
  'component',
  'classes',
  'sx',
];

const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(props, ref) {
    const {
      id,
      label,
      className,
      error,
      helperText,
      multiline,
      rows,
      minRows,
      maxRows,
      size,
      inputRef,
      inputProps = {},
      InputProps = {},
      required,
      ...rest
    } = props;
    MUI_ONLY.forEach((k) => delete (rest as any)[k]);
    const generatedId = React.useId();
    const inputId = inputProps.id || id || generatedId;
    const { startAdornment, endAdornment, readOnly } = InputProps;
    const controlProps = {
      ...pickDomProps(rest),
      ...inputProps,
      id: inputId,
      ref: inputRef,
      readOnly,
      required,
      'aria-invalid': error || inputProps['aria-invalid'] || undefined,
    };
    const textareaRows = rows || minRows;
    let control: React.ReactNode;
    if (startAdornment || endAdornment) {
      control = (
        <InputGroup className="sq-daisyui-text-field__group">
          {startAdornment && <InputGroupAddon>{startAdornment}</InputGroupAddon>}
          {multiline ? (
            <InputGroupTextarea rows={textareaRows} {...controlProps} />
          ) : (
            <InputGroupInput {...controlProps} />
          )}
          {endAdornment && (
            <InputGroupAddon align="inline-end">{endAdornment}</InputGroupAddon>
          )}
        </InputGroup>
      );
    } else if (multiline) {
      control = <Textarea rows={textareaRows} {...controlProps} />;
    } else {
      control = (
        <Input className={cn(size === 'small' && 'dy-input-sm')} {...controlProps} />
      );
    }
    return (
      <Field
        ref={ref}
        data-invalid={error || undefined}
        className={cn('sq-daisyui-text-field gap-1.5', className)}
      >
        {label && (
          <Label htmlFor={inputId}>
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </Label>
        )}
        {control}
        {helperText && (
          <FieldDescription className={cn(error && 'text-destructive')}>
            {helperText}
          </FieldDescription>
        )}
      </Field>
    );
  }
);

export default TextField;
export { TextField };
