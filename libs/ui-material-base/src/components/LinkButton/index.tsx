import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import Icon from '../Icon';
import Link from '../Link';
import Button from '../Button';
const { redirectTo } = utils.redirect;

const linkButtonMap = {
  Link,
  Button,
};

const LinkButton = ({
  to = '',
  children,
  color = 'primary',
  iconColor = 'none',
  className = '',
  onClick,
  iconSize,
  iconName,
  showOpenInNew,
  urlParams,
  buttonText,
  size = 'normal',
  type = 'Link',
  ...rest
}: any) => {
  const LinkToRender = linkButtonMap[type] || linkButtonMap.Link;
  return (
    <>
      {LinkToRender && (
        <LinkToRender
          className={className}
          iconName={iconName}
          iconColor={iconColor}
          color={color}
          urlParams={urlParams}
          size={size}
          buttonText={buttonText}
          to={to}
          {...rest}
          onClick={(e) => {
            onClick && onClick(e);
            // to && redirectTo(to, urlParams, { ...rest });
          }}
        ></LinkToRender>
      )}
      {showOpenInNew && (
        <Icon
          name={'OpenInNew'}
          size={'small'}
          className={'cur-pointer ml-2'}
          onClick={() => redirectTo(to, urlParams, { target: '_blank' })}
        />
      )}
    </>
  );
};
LinkButton.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
  disabled: PropTypes.bool,
  iconDirection: PropTypes.string,
  iconSize: PropTypes.string,
  urlParams: PropTypes.object,
  analytics: PropTypes.object,
  color: PropTypes.string,
  children: PropTypes.any,
  iconName: PropTypes.string,
  className: PropTypes.string,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  onAnalytics: PropTypes.func,
  to: PropTypes.string,
};

export default LinkButton;
