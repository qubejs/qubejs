import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Event = ({ item }) => {
  const params = (item.inputs && item.inputs.map((i) => i.name).join(', ')) || '';
  return (
    <>
      <div className="sq-content-doc__name">
        <h3 className="sq-content-doc__name-text">
          {item.name}
          {params && ['(', params, ')'].join('')}
        </h3>
      </div>
      {item.inputs && (
        <ul>
          {item.inputs.map((inputKey) => {
            return (
              <li>
                <div className="sq-content-doc__params-name">{inputKey.name}</div>
                <div>Type: {inputKey.type}</div>
                {inputKey.description && <div>{inputKey.description}</div>}
              </li>
            );
          })}
        </ul>
      )}
      <div className="sq-content-doc__info">
        <div className="sq-content-doc__info-row ">
          <div className="sq-content-doc__info-row-text">{item.description}</div>
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

Event.propTypes = {
  item: PropTypes.object
};

export default Event;
