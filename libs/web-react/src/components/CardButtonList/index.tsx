import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CardButton from '../CardButton';

const CardButtonList = ({ className = '', options = [], value, valueField = 'value', onChange, errorMessage, onAnalytics }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (data, option) => {
    const { analytics = {} } = option;
    const { click } = analytics;
    setCurrentValue(data.value);
    onChange &&
      onChange({
        value: data.value || ''
      });
    onAnalytics && click && onAnalytics(click);
  };

  return (
    <div className={`sq-card-button-list ${className}`}>
      <div className="sq-card-button-list__container">
        {options.map((option, idx) => {
          return (
            <CardButton
              key={idx}
              {...option}
              value={currentValue}
              selectedValue={option[valueField]}
              onChange={(data) => handleChange(data, option)}
            ></CardButton>
          );
        })}
      </div>
      {errorMessage && <div className="sq-error">{errorMessage}</div>}
    </div>
  );
};

CardButtonList.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
  valueField: PropTypes.string,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  options: PropTypes.array
};

export default CardButtonList;
