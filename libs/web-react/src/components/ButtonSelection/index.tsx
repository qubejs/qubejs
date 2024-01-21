import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
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
  variant = 'outlined',
}:any) => {
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
        <ButtonGroup variant={variant} aria-label={label} disabled={disabled}>
          {options?.map &&
            options.map((item, idx) => {
              const selectedProsp:any = {};
              const isSelected = item[valueField] === value;
              if (isSelected) {
                selectedProsp.variant = 'contained';
              }
              const { title, iconName, ...restItem } = item;
              return title ? (
                <Tooltip title={title} key={idx}>
                  <Button
                    key={idx}
                    {...selectedProsp}
                    {...restItem}
                    aria-label={item[textField]}
                    onClick={(e) => handleClick(e, item)}
                  >
                    {iconName && (
                      <Icon
                        variant={
                          isSelected
                            ? 'white'
                            : disabled
                            ? 'default'
                            : 'primary'
                        }
                        name={iconName}
                        size="xs"
                      />
                    )}
                    {item[textField]}
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  key={idx}
                  {...selectedProsp}
                  {...restItem}
                  aria-label={item[textField]}
                  onClick={(e) => handleClick(e, item)}
                >
                  {iconName && (
                    <Icon
                      variant={
                        isSelected ? 'white' : disabled ? 'default' : 'primary'
                      }
                      name={iconName}
                      size="xs"
                    />
                  )}
                  {item[textField]}
                </Button>
              );
            })}
        </ButtonGroup>
      </div>
      {errorMessage && (
        <div className="sq-error sq-button-selection__error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

ButtonSelection.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  onAnalytics: PropTypes.func,
  onChange: PropTypes.func,
  analytics: PropTypes.object,
};

export default ButtonSelection;
