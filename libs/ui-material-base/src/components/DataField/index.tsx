import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import Icon from '../Icon/Icon';
const { processor } = utils;
const { getFormatters } = utils.format;

const DataField = ({
  label,
  labelIcon,
  className = '',
  value = '',
  size = 'default',
  iconSize,
  labelIconSize = 'small',
  defaultText = '--',
  fieldType = '',
  optionsName,
  formatter = {},
  options,
  ...rest
}: any) => {
  const fields = utils.storage.components.get();
  const RenderText = fields[fieldType] || fields.Text;
  let otherProps: any = {};
  if (optionsName || options) {
    otherProps = processor.execute('globals.getOption', value, { optionsName, options, ...rest });
  }
  const { type, ...restFormatter }:any = formatter;
  const formatters = getFormatters();
  const newValue = (type && formatters[type] && formatters[type](value, restFormatter)) || value;
  return (
    <div className={`sq-data-field ${className} sq-data-field--${size}`}>
      <label className="sq-data-field__label">{labelIcon && <Icon name={labelIcon} size={labelIconSize} variant={'normal'} />}{label}</label>
      <div className="sq-data-field__container">
        <div className="sq-data-field__value">
          <RenderText {...otherProps} value={otherProps?.text || newValue || defaultText} size={iconSize} {...rest} />
        </div>
      </div>
    </div>
  );
};

DataField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onAnalytics: PropTypes.func,
  analytics: PropTypes.object,
};

export default DataField;
