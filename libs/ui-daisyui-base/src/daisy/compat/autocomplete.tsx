import * as React from 'react';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from '../ui/badge';
import { Command, CommandEmpty, CommandItem, CommandList } from '../ui/command';
import { Label } from '../ui/label';
import { Popover, PopoverAnchor, PopoverContent } from '../ui/popover';

/**
 * Autocomplete with the subset of the MUI <Autocomplete> API used by qubejs components
 * (options, value, multiple, freeSolo, inputValue/onInputChange, onChange(e, value),
 * getOptionLabel, filterOptions, chips), built from daisyUI-styled popover, menu and badge.
 */
export interface AutocompleteProps<T = any> {
  id?: string;
  label?: React.ReactNode;
  options: T[];
  value: T | T[] | null;
  multiple?: boolean;
  freeSolo?: boolean;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  popoverClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  inputProps?: Record<string, any>;
  inputValue: string;
  getOptionLabel?: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
  renderTag?: (option: T) => React.ReactNode;
  isTagDisabled?: (option: T) => boolean;
  filterOptions?: (options: T[], state: { inputValue: string; getOptionLabel: (o: T) => string }) => T[];
  onChange: (event: any, value: any) => void;
  onInputChange: (event: any, value: string, reason: 'input' | 'reset' | 'clear') => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  noOptionsText?: React.ReactNode;
}

const defaultLabel = (option: any) =>
  typeof option === 'string' ? option : option?.label ?? option?.text ?? '';

export function Autocomplete<T = any>({
  id,
  label,
  options,
  value,
  multiple,
  freeSolo,
  disabled,
  error,
  placeholder,
  className,
  inputClassName,
  popoverClassName,
  inputRef,
  inputProps = {},
  inputValue,
  getOptionLabel = defaultLabel,
  renderOption,
  renderTag,
  isTagDisabled,
  filterOptions,
  onChange,
  onInputChange,
  onBlur,
  onKeyDown,
  noOptionsText = 'No options',
}: AutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false);
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const selected: T[] = multiple ? ((value as T[]) || []) : [];
  const labelOf = (o: T) => getOptionLabel(o) || '';

  const visibleOptions = React.useMemo(() => {
    const list = Array.isArray(options) ? options : [];
    if (filterOptions) return filterOptions(list, { inputValue, getOptionLabel: labelOf });
    const q = (inputValue || '').toLowerCase();
    // in single mode, show everything when the input just mirrors the current value
    if (!multiple && value && labelOf(value as T).toLowerCase() === q) return list;
    return q ? list.filter((o) => labelOf(o).toLowerCase().includes(q)) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, inputValue, filterOptions, multiple, value]);

  const select = (event: any, option: T) => {
    if (multiple) {
      if (!selected.includes(option)) onChange(event, [...selected, option]);
      onInputChange(event, '', 'reset');
    } else {
      onChange(event, option);
      onInputChange(event, labelOf(option), 'reset');
      setOpen(false);
    }
  };

  const remove = (event: any, option: T) => {
    onChange(event, selected.filter((o) => o !== option));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown && onKeyDown(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Escape') setOpen(false);
    if (event.key === 'ArrowDown' && !open) setOpen(true);
    if (multiple && event.key === 'Backspace' && !inputValue && selected.length) {
      const last = selected[selected.length - 1];
      if (!isTagDisabled || !isTagDisabled(last)) remove(event, last);
    }
    // free text: add the typed value when nothing in the list matches it
    if (event.key === 'Enter' && freeSolo && inputValue && visibleOptions.length === 0) {
      event.preventDefault();
      if (multiple) {
        onChange(event, [...selected, inputValue as any]);
        onInputChange(event, '', 'reset');
      } else {
        onChange(event, inputValue);
      }
    }
  };

  return (
    <div className={cn('sq-daisyui-autocomplete flex w-full flex-col gap-1.5', className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Command shouldFilter={false}>
        <Popover open={open && !disabled} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div
              data-part="autocomplete-control"
              aria-invalid={error || undefined}
              className={cn(
                'dy-input flex h-auto min-h-10 w-full flex-wrap items-center gap-1 py-1',
                disabled && 'pointer-events-none opacity-50',
                inputClassName
              )}
              onClick={() => !disabled && setOpen(true)}
            >
              {multiple &&
                selected.map((option, idx) => {
                  const locked = disabled || (isTagDisabled ? isTagDisabled(option) : false);
                  return (
                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                      {renderTag ? renderTag(option) : labelOf(option)}
                      {!locked && (
                        <button
                          type="button"
                          aria-label={`Remove ${labelOf(option)}`}
                          className="rounded-sm opacity-60 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(e, option);
                          }}
                        >
                          <XIcon className="size-3" />
                        </button>
                      )}
                    </Badge>
                  );
                })}
              <input
                {...inputProps}
                id={inputId}
                ref={inputRef}
                role="combobox"
                aria-expanded={open}
                aria-autocomplete="list"
                autoComplete="off"
                disabled={disabled}
                placeholder={placeholder}
                value={inputValue}
                className="min-w-16 flex-1 bg-transparent px-1 py-0.5 outline-none"
                onChange={(e) => {
                  onInputChange(e, e.target.value, 'input');
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
              />
              <ChevronDownIcon className="mr-0.5 size-4 shrink-0 opacity-50" />
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            matchWidth
            className={cn('p-1', popoverClassName)}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              // clicks inside the control keep the list open
              const target = e.target as HTMLElement;
              if (target.closest?.('[data-part=autocomplete-control]')) e.preventDefault();
            }}
          >
            <CommandList>
              <CommandEmpty>{noOptionsText}</CommandEmpty>
              {visibleOptions.map((option, idx) => (
                <CommandItem
                  key={`${labelOf(option)}_${idx}`}
                  value={`${idx}`}
                  data-checked={selected.includes(option) || value === option || undefined}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => select({ type: 'select' }, option)}
                >
                  {renderOption ? renderOption(option) : labelOf(option)}
                </CommandItem>
              ))}
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  );
}

export default Autocomplete;
