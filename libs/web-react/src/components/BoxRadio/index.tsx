import PropTypes from 'prop-types';
import Icon from '../Icon';
import './_box-radio.scss';

const BoxRadio = ({
  className = '',
  errorMessage,
  label,
  options = [],
  eyebrowField = 'eyebrow',
  defaultValue,
  textField = 'text',
  valueField = 'value',
  disabled,
  value,
  onChange,
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
    <div className={`sq-box-radio ${className}`}>
      {label && <div className="sq-box-radio__label">{label}</div>}
      <div className="sq-box-radio__container">
        {options?.map &&
          options.map((item, idx) => {
            const selectedProsp: any = {};
            const isSelected = item[valueField] === value;
            if (isSelected) {
              selectedProsp.variant = 'contained';
            }
            const { title, iconName, ...restItem } = item;
            return (
              <div className={`sq-box-radio__item ${item[valueField] === value ? 'selected' : ''}`} onClick={(e) => handleClick(e, item)}>
                <div className="sq-box-radio__eyebrow">
                  {item[eyebrowField]}
                </div>
                <div className="sq-box-radio__header">
                  <h4>{item[textField]}</h4>
                </div>
                {iconName && (
                  <Icon
                    variant={
                      isSelected ? 'white' : disabled ? 'default' : 'primary'
                    }
                    name={iconName}
                    size="xs"
                  />
                )}
              </div>
            );
          })}
      </div>
      {errorMessage && (
        <div className="sq-error sq-box-radio__error">{errorMessage}</div>
      )}
    </div>
  );
};

BoxRadio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onAnalytics: PropTypes.func,
  analytics: PropTypes.object,
};

export default BoxRadio;
