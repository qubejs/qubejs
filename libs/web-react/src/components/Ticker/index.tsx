import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import { getFormatters } from '../../utils/format';

const configVals = {
  default: {
    down: 'sq-text-success',
    up: 'sq-text-error'
  },
  invert: {
    down: 'sq-text-error',
    up: 'sq-text-success'
  }
};

function Ticker({ value, className = '', formatter = {}, theme = '', style = 'default', row }:any) {
  const formatters = getFormatters();
  const { type, ...restFormatter } = formatter;
  const classCompt = configVals[style] || configVals.default;
  const iconName = value < 0 ? 'arrowdropdown' : value > 0 ? 'arrowdropup' : '';
  const classColor = value < 0 ? `${classCompt.down} ${theme}` : value > 0 ? `${classCompt.up} ${theme}` : `sq-text-muted ${theme}`;
  const finalValue = (type && formatters[type] && formatters[type](value, { ...restFormatter }, row)) || value;
  return (
    <div className={`sq-small-ticker ${className} ${classColor}`}>
      <div className="sq-small-ticker__container">
        {iconName && <Icon variant="normal" className="sq-small-ticker__icon" name={iconName} />}
        <span className="sq-small-ticker__text">{finalValue}</span>
      </div>
    </div>
  );
}

Ticker.propTypes = {
  value: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.string,
  formatter: PropTypes.object,
  row: PropTypes.object
};

export default Ticker;
