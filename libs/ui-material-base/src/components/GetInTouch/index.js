import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import HTML from '../HTML';
import LinkButton from '../LinkButton';
import './_get-in-touch.scss';

const GetInTouch = ({ className = '', header, info = [], footerText, bgColor, textColor }) => {
  let cntStyles = {};
  if (bgColor) {
    cntStyles.backgroundColor = bgColor;
  }
  if (textColor) {
    cntStyles.color = textColor;
  }
  return (
    <div className={`sq-get-in-touch container-fluid container-max ${className}`}>
      <div className="sq-get-in-touch__container" style={cntStyles}>
        <h1 className="sq-get-in-touch__header mb-jumbo">{header}</h1>
        <div className="sq-get-in-touch__info mb-jumbo row">
          {info.map((item, idx) => {
            return (
              <div className="sq-get-in-touch__info-item col col-md-4" key={idx}>
                <Icon className="" size={item.iconSize || "normal"} variant={item.iconColor || "normal"} name={item.iconName} />
                {!item.href && item.text}
                {item.href && <LinkButton className='sq-get-in-touch__info__link' to={item.href} href={item.href} buttonText={item.text} target={item.target} />}
              </div>
            );
          })}
        </div>
        {footerText && (
          <div className="sq-get-in-touch__footer-text">
            <HTML value={footerText} />{' '}
          </div>
        )}
      </div>
    </div>
  );
};

GetInTouch.propTypes = {
  footerText: PropTypes.string,
  className: PropTypes.string,
  header: PropTypes.string,
  info: PropTypes.array,
};

export default GetInTouch;
