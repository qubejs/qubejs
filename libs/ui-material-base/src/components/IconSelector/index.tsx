import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';

import Icon from '../Icon';
const { icons } = utils.storage;
const { getValue } = utils.properties;


const IconSelector = ({ label, value, iconSet, className = '', variant = 'default', size = 'normal', iconClass = '', row, onChange }: any) => {
  const finalIconClass = getValue(this, iconClass, row);
  const list = iconSet ? icons.get(iconSet) : icons.getAll();
  const handleOnChange = (icon) => {
    onChange &&
      onChange({
        value: icon
      });
  };
  return (
    <div className={`sq-icon-selector ${className}`}>
      {label}
      <div className="sq-icon-selector__icon-container">
        <div
          title={`default icon`}
          onClick={() => handleOnChange('')}
          className={`sq-icon-selector__icon-item ${!value ? 'sq-icon-selector__icon-item--selected' : ''}`}
        >
          <Icon textIcon={'N'} iconClass={finalIconClass} variant={variant} size={size} />
        </div>
        {Object.keys(list).map((icon, idx) => {
          return (
            <div
              key={idx}
              title={`${icon}`}
              onClick={() => handleOnChange(icon)}
              className={`sq-icon-selector__icon-item ${value === icon ? 'sq-icon-selector__icon-item--selected' : ''}`}
            >
              <Icon name={icon} iconClass={finalIconClass} variant={variant} size={size} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

IconSelector.propTypes = {
  className: PropTypes.string,
  row: PropTypes.object,
  onClick: PropTypes.func,
  variant: PropTypes.any,
  iconSet: PropTypes.string,
  classes: PropTypes.object,
  size: PropTypes.string
};

export default IconSelector;
