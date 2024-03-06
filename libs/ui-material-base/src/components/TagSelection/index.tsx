import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import TagLabel from '../TagLabel';
import { utils } from '@qubejs/web-react';
import './_tag-selection.scss';
const { getValue } = utils.properties;

const TagSelection = ({ className = '', multiple = false, label, value, options, iconName, disabled, selectedColor = 'primary', iconSize = 'small', width = 'auto', size = 'medium', variant = 'filled-dark', color = 'default', onChange, textField = 'text', valueField = 'value', row }: any) => {
  const finalOptions = getValue(this, options, row);
  const handleClick = useCallback(
    (item) => {
      let sendValue;
      if (!multiple) {
        sendValue = item[valueField] === value ? '' : item[valueField];
      } else {
        const newValue = [...(value || [])];
        if (newValue.indexOf(item[valueField]) > -1) {
          newValue.splice(newValue.indexOf(item[valueField]), 1);
        } else {
          newValue.push(item[valueField]);
        }
        sendValue = newValue;
      }
      onChange &&
        onChange({
          value: sendValue,
        });
    },
    [value]
  );
  return (
    <div className={`sq-tag-selection ${className}`}>
      <div className="sq-tag-selection__label">{label}</div>
      <div className="sq-tag-selection__items">
        {finalOptions?.map((item, idx) => {
          const finalColor = (!multiple ? value === item[valueField] : value?.indexOf(item[valueField]) > -1) ? selectedColor : 'default';
          return <TagLabel key={idx} iconName={iconName} width={width} size={size} iconSize={iconSize} variant={variant} color={finalColor} {...item} value={item[textField]} onClick={() => handleClick(item)} />;
        })}
      </div>
    </div>
  );
};
TagSelection.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.any,
  row: PropTypes.object,
  tag: PropTypes.string,
  parentTag: PropTypes.string,
};

export default TagSelection;
