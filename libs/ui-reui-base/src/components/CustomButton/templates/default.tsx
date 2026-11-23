import Icon from '../../Icon';

const TemplateDefault = ({ iconName, size, variant, buttonText, children } :any) => {
  return (
    <>
      {iconName && <Icon className="sq-custom-button__icon" name={iconName} size={size} variant={variant} />}
      {children && <div className="sq-custom-button__info-text">{children}</div>}
      <div className="sq-custom-button__text">{buttonText}</div>
    </>
  );
};

export default TemplateDefault;
