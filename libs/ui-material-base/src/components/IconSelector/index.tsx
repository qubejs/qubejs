import { useState } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';

// import Icon from './Icon';
const { icons } = utils.storage;
const { getValue } = utils.properties;
// import PropTypes from 'prop-types';
// import { getValue } from '../../utils/properties';
// import { icons } from '../../utils/storage';
// import Button from '../ui/Button';
// import Icon from '../Icon';
// import Dialog from '../Dialog';

const IconSelector = ({
  label,
  value,
  iconSet,
  className = '',
  variant = 'default',
  size = 'normal',
  iconClass = '',
  row,
  onChange,
}) => {
  const { Button, Icon, Dialog } = utils.storage.components.get();
  const finalIconClass = getValue(this, iconClass, row);
  const [open, setOpen] = useState(false);
  const list = iconSet ? icons.get(iconSet) : icons.getAll();
  const handleOnChange = (icon) => {
    onChange &&
      onChange({
        value: icon,
      });
  };
  return (
    <div className={`sq-icon-selector ${className}`}>
      {label}
      {value && <Icon name={value} />}{' '}
      <Button size="small" buttonText={value ? 'Change' : 'Select'} onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        title={'Icon Selector'}
        actions={[{ buttonText: 'Ok', actionType: 'close' }, { buttonText: 'Clear', actionType: 'clear' }]}
        onClose={() => setOpen(false)}
        onAction={(data, action) => {
          if (action.actionType === 'close') {
            setOpen(false)
          } else if (action.actionType === 'clear') {
            handleOnChange('');
            setOpen(false)
          }
        }}
      >
        <div className="sq-icon-selector__icon-container">
          <div
            title={`default icon`}
            onClick={() => handleOnChange('')}
            className={`sq-icon-selector__icon-item ${
              !value ? 'sq-icon-selector__icon-item--selected' : ''
            }`}
          >
            <Icon
              textIcon={'N'}
              iconClass={finalIconClass}
              variant={variant}
              size={size}
            />
          </div>
          {Object.keys(list).map((icon, idx) => {
            return (
              <div
                key={idx}
                title={`${icon}`}
                onClick={() => handleOnChange(icon)}
                className={`sq-icon-selector__icon-item ${
                  value === icon ? 'sq-icon-selector__icon-item--selected' : ''
                }`}
              >
                <Icon
                  name={icon}
                  iconClass={finalIconClass}
                  variant={variant}
                  size={size}
                />
              </div>
            );
          })}
        </div>
      </Dialog>
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
  size: PropTypes.string,
};

export default IconSelector;
