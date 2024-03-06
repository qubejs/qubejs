import PropTypes from 'prop-types';
import Icon from '../Icon';

const FieldText = ({
  className = '',
  value,
  iconName,
  iconSize = 'small',
  iconColor,
  variant = 'default',
  color = 'primary',
}: any) => {
  return (
    <div
      className={`sq-field-text ${className} sq-field-text--${variant} sq-field-text--${color}`}
    >
      <div className="sq-field-text__container">
        {iconName && <Icon name={iconName} size={iconSize} variant={iconColor} />}
        {value}
      </div>
    </div>
  );
};
FieldText.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.any,
  row: PropTypes.object,
  tag: PropTypes.string,
  parentTag: PropTypes.string,
};

export default FieldText;
