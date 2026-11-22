import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import Icon from '../Icon';
const { getValue } = utils.properties;

const TagLabel = ({ className = '', value, iconName, disabled, width = 'auto', iconSize = 'small', size = 'medium', variant = 'filled', color = 'primary', onClick, row } :any) => {
  const finalColor = !disabled ? getValue(this, color, row) : 'disabled';
  const finalVariant = getValue(this, variant, row);
  return (
    <div className={`sq-tag-label sq-tag-label--${width}  sq-tag-label--${size} ${className} sq-tag-label--${finalVariant} ${finalColor}`} onClick={onClick}>
      <div className="sq-tag-label__container">
        {iconName && <Icon name={iconName} size={iconSize} variant="normal" />}
        {value}
      </div>
    </div>
  );
};
TagLabel.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.any,
  row: PropTypes.object,
  tag: PropTypes.string,
  parentTag: PropTypes.string,
};

export default TagLabel;
