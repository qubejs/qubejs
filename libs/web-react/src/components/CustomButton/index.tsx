import PropTypes from 'prop-types';
import Default from './templates/default';

const templatesObject: any = {
  default: Default
};


const CustomButton = ({
  classes,
  className = '',
  actionValue,
  buttonText,
  iconName = '',
  size = 'normal',
  template = 'default',
  variant = 'default',
  color = 'default',
  onClick,
  analytics = {},
  onAnalytics,
  children,
  ...rest
}: any) => {
  const handleOnKeyPress = (evt) => {
    if (evt.key === 'Enter' || evt.key === 'Space') {
      !disabled && onClick && onClick(evt);
      !disabled && click && onAnalytics && onAnalytics(click);
    }
  };

  const { disabled, target, href, tagName = 'div' } = rest;
  const { click } = analytics;
  const TemplateToRender = templatesObject[template] || templatesObject.default;
  const TagNameForRender = tagName;
  const otherProps: any = {};
  if (href) {
    otherProps.href = href;
  }
  return (
    <TagNameForRender
      role="button"
      target={target}
      {...otherProps}
      tabIndex={disabled ? "-1" : "0"}
      className={`sq-custom-button ${className} ${size} ${template ? ' sq-custom-button-tpl--' + template : ''} 
      ${color ? ' sq-custom-button--' + color : ''}
      ${disabled ? ' sq-custom-button--disabled' : ''}
      `}
      onKeyPress={handleOnKeyPress}
      onClick={(e) => {
        !disabled && onClick && onClick(e);
        !disabled && click && onAnalytics && onAnalytics(click);
      }}
    >
      <div className="sq-custom-button__container">
        <TemplateToRender iconName={iconName} size={size} buttonText={buttonText} variant={rest.variant} >{children}</TemplateToRender>
      </div>
    </TagNameForRender>
  );
};

CustomButton.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  actionValue: PropTypes.string,
  onAnalytics: PropTypes.func,
  analytics: PropTypes.object,
  buttonText: PropTypes.string,
  iconName: PropTypes.string
};

export default CustomButton;
