import React from 'react';
import PropTypes from 'prop-types';
import HTML from '../HTML';
import './_disclaimer.scss';

const Disclaimer = ({ className = '', innerClassName = 'container-max', text = '' }) => {
  return (
    <div className={`sq-disclaimer ${className}`}>
      <HTML className={`sq-disclaimer__text ${innerClassName}`} value={text} />
    </div>
  );
};

Disclaimer.propTypes = {
  styleName: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string,
};

export default Disclaimer;
