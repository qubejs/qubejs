import React from 'react';
import PropTypes from 'prop-types';
import DataField from '../DataField';


const DataFieldList = ({
  label,
  className = '',
  fields = [],
  value = {},
  size = 'default',
  onClick,
  analytics = {},
  onAnalytics,
  ...rest
}) => {
  // const handleOnKeyPress = (evt) => {
  //   if (evt.key === 'Enter' || evt.key === 'Space') {
  //     !disabled && onClick && onClick(evt);
  //     !disabled && click && onAnalytics && onAnalytics(click);
  //   }
  // };

  // const { disabled } = rest;
  // const { click } = analytics;
  return (
    <div className={`sq-data-field-list ${className}`}>
      <div className="sq-data-field-list__container">
        {fields.map((field) => {
          return (
            <DataField {...field} value={value[field.fieldName]} {...rest} />
          );
        })}
      </div>
    </div>
  );
};

DataFieldList.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onAnalytics: PropTypes.func,
  analytics: PropTypes.object,
};

export default DataFieldList;
