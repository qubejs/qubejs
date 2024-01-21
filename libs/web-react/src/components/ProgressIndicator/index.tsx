import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';


const _configRange = [
  {
    min: 80,
    className: 'red'
  },
  {
    min: 50,
    className: 'orange'
  },
  {
    min: 0,
    className: 'green'
  }
];

const ProgressIndicator = ({ variant = 'determinate', color = 'primary', value = 0, className = '' }:any) => {
  const finalValue = value > 100 ? 100 : value || 0;
  let colorToApply;
  _configRange.forEach((item) => {
    if (!colorToApply && value >= item.min) {
      colorToApply = item.className;
      return false;
    }
  });
  return (
    <div className={`sq-progress-indicator ${className} sq-progress-indicator--${colorToApply}`}>
      <div className="sq-progress-indicator__container">
        <div className="sq-progress-indicator__bar">
          <LinearProgress className={`sq-progress-indicator__progress-bar`} color={color} variant={variant} value={finalValue} />
        </div>
        <div className="sq-progress-indicator__label">
          {finalValue.toString()}
          {finalValue < value * 1 ? '+' : ''}%
        </div>
      </div>
    </div>
  );
};

ProgressIndicator.propTypes = {
  value: PropTypes.number,
  type: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string
};

export default ProgressIndicator;
