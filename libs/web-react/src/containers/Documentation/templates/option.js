import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';

const Option = ({ item }) => {
  return (
    <>
      <h3>{item.name}</h3>
      <div className="sq-content-doc__info">
        <div className="sq-content-doc__info-row">
          <div className="sq-content-doc__info-row-label">Type:</div>
          <div className="sq-content-doc__info-row-text">{item.type}</div>
        </div>
        <div className="sq-content-doc__info-row mb-xtrawide">
          <div className="sq-content-doc__info-row-label">Default:</div>
          <code className="sq-content-doc__info-row-code">{item.defaultValue && item.defaultValue.toString()}</code>
        </div>
        <div className="sq-content-doc__info-row ">
          <div className="sq-content-doc__info-row-text">{ReactHtmlParser(item.description)}</div>
        </div>
        {item.note && <div className="sq-content-doc__info-row">
          <div className="sq-content-doc__info-row-text">
            <span className="sq-content-doc__info-row-label">Note: </span>
            {item.note}
          </div>
        </div>}
      </div>
    </>
  );
};

Option.propTypes = {
  item: PropTypes.object
};

export default Option;
