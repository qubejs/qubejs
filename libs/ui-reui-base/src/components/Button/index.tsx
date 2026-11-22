import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import { Button } from '../../reui/ui/button';
import { toReuiButtonSize, toReuiButtonVariant } from '../../reui/compat/mui-props';
import Icon from '../Icon';

const { idFromLabel } = utils.properties;

const CustomButton = ({
  className = '',
  actionValue,
  buttonText,
  iconName = '',
  iconSize = 'small',
  iconColor = '',
  iconDirection = 'left',
  size = 'medium',
  onClick,
  disabled,
  analytics = {},
  onAnalytics,
  children,
  ...rest
}: any) => {
  const {
    variant = 'contained',
    color = 'primary',
    startIcon,
    endIcon,
    href,
  }: any = rest;
  const { click }: any = analytics;
  const testId = idFromLabel(buttonText);
  const content = (
    <>
      {startIcon}
      {iconName && iconDirection === 'left' && (
        <Icon
          className="left"
          name={iconName}
          size={iconSize || size}
          variant={iconColor || 'normal'}
        />
      )}
      {buttonText}
      {iconName && iconDirection === 'right' && (
        <Icon
          className="right"
          name={iconName}
          size={iconSize || size}
          variant={iconColor || 'normal'}
        />
      )}
      {children}
      {endIcon}
    </>
  );
  return (
    <div
      className={`sq-button ${className} ${size} ${
        !buttonText && iconName ? 'sq-button--icon-only' : ''
      }`}
      data-testid={testId}
    >
      <Button
        onClick={(e) => {
          !disabled && onClick && onClick(e);
          !disabled && click && onAnalytics && onAnalytics(click);
        }}
        data-testid={`${testId}_button`}
        size={toReuiButtonSize(size)}
        variant={toReuiButtonVariant(variant, color)}
        className={`sq-button__control sq-button--${variant} sq-button--color-${color}`}
        disabled={Boolean(disabled)}
        asChild={!!href}
      >
        {href ? <a href={href}>{content}</a> : content}
      </Button>
    </div>
  );
};
CustomButton.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  iconSize: PropTypes.string,
  iconDirection: PropTypes.string,
  size: PropTypes.string,
  actionValue: PropTypes.string,
  onAnalytics: PropTypes.func,
  onClick: PropTypes.func,
  analytics: PropTypes.object,
  buttonText: PropTypes.string,
  iconName: PropTypes.string,
};

export default CustomButton;
