import React from 'react';
import PropTypes from 'prop-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../reui/ui/dropdown-menu';
import Icon from '../Icon';
import TagLabel from '../TagLabel';

function TagDropdown({ disabled, value, anchorOrigin = {}, transformOrigin = {}, textField = 'text', valueField = 'value', defaultText = 'Select', options = [], className = '', onChange, ...rest }: any) {
  const [open, setOpen] = React.useState(false);
  const _onChange = (item) => {
    !disabled &&
      onChange &&
      onChange({
        value: item[valueField],
      });
    setOpen(false);
  };

  const valueOption = options.filter((i) => i[valueField] === value);
  const valueFound = valueOption.length > 0 ? valueOption[0] : {};
  const align = anchorOrigin.horizontal === 'right' ? 'end' : anchorOrigin.horizontal === 'center' ? 'center' : 'start';

  return (
    <div className={`sq-tag-dropdown ${className}`}>
      <div className="flex items-center text-center">
        <DropdownMenu open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <div className="sq-tag-dropdown__wrapper" role="button" tabIndex={disabled ? -1 : 0}>
              <TagLabel {...rest} {...valueFound} value={valueFound[textField] || value || '--'} disabled={disabled}></TagLabel>
              <Icon className={`sq-tag-dropdown__icon ${open ? 'active' : ''}`} size="xs" name="arrow-down" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="sq-tag-dropdown__menu">
            {options.map((option) => {
              return (
                <DropdownMenuItem
                  disabled={option.disabled || disabled}
                  className="sq-tag-label--list-item-wrap"
                  onSelect={() => _onChange(option)}
                  key={option[valueField]}
                >
                  {<TagLabel {...option} className={`sq-tag-label--list-item ${option.className}`} value={option[textField]}></TagLabel>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

TagDropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  row: PropTypes.object,
  anchorOrigin: PropTypes.object,
  transformOrigin: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  textField: PropTypes.string,
  valueField: PropTypes.string,
};

export default TagDropdown;
