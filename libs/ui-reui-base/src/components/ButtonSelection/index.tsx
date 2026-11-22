import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../reui/ui/button';
import { ButtonGroup } from '../../reui/ui/button-group';
import { Tooltip } from '../../reui/compat/tooltip';
import { toReuiButtonSize } from '../../reui/compat/mui-props';
import Icon from '../Icon';

const ButtonSelection = ({
  className = '',
  errorMessage,
  label,
  options = [],
  defaultValue,
  textField = 'text',
  valueField = 'value',
  disabled,
  value,
  onChange,
  size,
  variant = 'outlined',
  ...rest
}: any) => {
  const handleClick = (e, option) => {
    if (option[valueField] !== value) {
      onChange &&
        onChange({
          value: option[valueField],
          text: option[textField],
        });
    } else {
      onChange &&
        onChange({
          value: defaultValue || undefined,
        });
    }
  };

  return (
    <div className={`sq-button-selection ${className}`}>
      {label && <div className="sq-button-selection__label">{label}</div>}
      <div className="sq-button-selection__container">
        <ButtonGroup aria-label={label} className={`sq-button-selection__group sq-button-selection--${variant}`}>
          {options?.map &&
            options.map((item, idx) => {
              const isSelected = item[valueField] === value;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { title, iconName, [textField]: text, [valueField]: itemValue, ...restItem } = item;
              const button = (
                <Button
                  key={idx}
                  type="button"
                  size={toReuiButtonSize(size)}
                  variant={isSelected ? 'default' : 'outline'}
                  disabled={disabled || restItem.disabled}
                  aria-pressed={isSelected}
                  aria-label={text}
                  data-selected={isSelected || undefined}
                  className={isSelected ? 'sq-button-selection__item--selected' : 'sq-button-selection__item'}
                  onClick={(e) => handleClick(e, item)}
                >
                  {iconName && (
                    <Icon
                      variant={isSelected ? 'white' : disabled ? 'default' : 'primary'}
                      name={iconName}
                      size="xs"
                    />
                  )}
                  {text}
                </Button>
              );
              return title ? (
                <Tooltip title={title} key={idx}>
                  {button}
                </Tooltip>
              ) : (
                button
              );
            })}
        </ButtonGroup>
      </div>
      {errorMessage && (
        <div className="sq-error sq-button-selection__error">{errorMessage}</div>
      )}
    </div>
  );
};

ButtonSelection.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  onAnalytics: PropTypes.func,
  onChange: PropTypes.func,
  analytics: PropTypes.object,
};

export default ButtonSelection;
