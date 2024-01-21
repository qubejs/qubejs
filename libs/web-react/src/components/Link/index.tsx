import PropTypes from 'prop-types';
import Icon from '../Icon';
import { redirectTo } from '../../utils/redirect';
import { QueryString } from '../../utils/query-string';
import { resolveImageUrl } from '../../cordova';

const Link = ({ to = '', href = '', children, className = '', showOpenInNew = false, onClick, img, size = 'normal', iconDirection = 'left', color = 'default', urlParams = {}, iconName, iconColor, iconSvg, buttonText, disabled, ...rest }:any) => {
  const { target, analytics = {}, onAnalytics } = rest;
  const { click } = analytics;
  const urlFinal = (to || href || '#') + (urlParams ? new QueryString(urlParams).toString() : '');
  return (
    <>
      <a
        href={urlFinal}
        onClick={(e) => {
          if (urlFinal || urlFinal === '#') {
            e.preventDefault();
            e.stopPropagation();
          }
          !disabled && onClick && onClick(e);
          !disabled && to && redirectTo(to, urlParams, { target });
          !disabled &&
            click &&
            onAnalytics &&
            onAnalytics({
              ...click,
            });
        }}
        target={target}
        className={`sq-link sq-link--${color} sq-link--${size} ${className}${disabled ? ' sq-link--disabled' : ''}`}
      >
        <div className="sq-link__container">
          {iconDirection === 'left' && iconName && <span className="sq-link__icon">{<Icon name={iconName} svg={iconSvg} variant={iconColor || color} size={size} />}</span>}
          {(children || buttonText) && <span className="sq-link__text">{children || buttonText}</span>}
          {img && <img src={resolveImageUrl(img)} />}
          {iconDirection === 'right' && iconName && <span className="sq-link__icon">{<Icon name={iconName} svg={iconSvg} variant={iconColor || color} size={size} />}</span>}
        </div>
      </a>
      {showOpenInNew && <Icon name={'OpenInNew'} size={'small'} className={'cur-pointer ml-2'} onClick={() => !disabled && redirectTo(to, urlParams, { target: '_blank' })} />}
    </>
  );
};
Link.propTypes = {
  size: PropTypes.string,
  iconDirection: PropTypes.string,
  children: PropTypes.any,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  className: PropTypes.string,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Link;
