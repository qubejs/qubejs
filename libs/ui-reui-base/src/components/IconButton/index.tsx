import PropTypes from 'prop-types';
import { Button } from '../../reui/ui/button';
import { Tooltip } from '../../reui/compat/tooltip';
import { toReuiIconButtonSize } from '../../reui/compat/mui-props';
import { utils } from '@qubejs/web-react';
import Icon from '../Icon';
const { redirectTo } = utils.redirect;

const SQIconButton = ({
  to = '',
  title,
  variant = 'outlined',
  disabled = false,
  color = 'primary',
  className = '',
  onClick,
  size,
  iconSize = 'normal',
  iconName,
  urlParams = {},
  ...rest
}:any) => {
  const finalColor = disabled ? 'default' : color;
  const propsTOPass: any = {
    className: 'sq-icon-button__button',
    disabled: disabled,
    variant: 'ghost',
    size: toReuiIconButtonSize(size),
    type: 'button',
    onClick: (e) => {
      !disabled && onClick && onClick(e);
      !disabled && to && redirectTo(to, urlParams, { ...rest });
    },
  };
  const button = (
    <Button {...propsTOPass} className={`${propsTOPass.className} rounded-full`}>
      <Icon
        className={`sq-icon--${variant}`}
        name={iconName}
        variant={finalColor}
        color={finalColor}
        size={iconSize}
      />
    </Button>
  );
  return (
    <div
      className={`sq-icon-button ${className} ${
        disabled ? 'sq-icon-button--disabled' : ''
      }`}
    >
      {!title && button}
      {title && (
        <Tooltip title={title}>
          <span>{button}</span>
        </Tooltip>
      )}
    </div>
  );
};
SQIconButton.propTypes = {
  size: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  iconSize: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  children: PropTypes.any,
  iconName: PropTypes.string,
  className: PropTypes.string,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default SQIconButton;
