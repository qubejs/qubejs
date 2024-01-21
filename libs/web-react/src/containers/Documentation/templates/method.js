import React, { Component } from 'react';
import ReactHtmlParser from 'html-react-parser';
import PropTypes from 'prop-types';

const Method = ({ item }) => {
  const params = (item.inputs && item.inputs.map((i) => i.name).join(',')) || '';
  return (
    <>
      <div className="sq-content-doc__name">
        <h3 className="sq-content-doc__name-text">
          {item.name}
          {params && ['(', params, ')'].join('')}
        </h3>
        {item.returns && (
          <div className="sq-content-doc__info-row mb-xtrawide">
            <div className="sq-content-doc__info-row-label">Returns:</div>
            <div className="sq-content-doc__info-row-text">{item.returns}</div>
          </div>
        )}
      </div>
      {item.inputs && (
        <ul className="sq-content-doc__params">
          {item.inputs.map((inputKey, idx) => {
            return (
              <li key={idx}>
                <div className="sq-content-doc__params-name">{inputKey.name}</div>
                <div>Type: {inputKey.type}</div>
                <div>{ReactHtmlParser(inputKey.description)}</div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="sq-content-doc__info">
        <div className="sq-content-doc__info-row ">
          <div className="sq-content-doc__info-row-text">{item.description}</div>
        </div>
        {item.note && (
          <div className="sq-content-doc__info-row">
            <div className="sq-content-doc__info-row-text">
              <span className="sq-content-doc__info-row-label">Note: </span>
              {item.note}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Method.propTypes = {
  item: PropTypes.object
};

export default Method;
