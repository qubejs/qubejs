import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const ImageSliderDefault = ({ className = '', items, classes = {} }:any) => {
  return (
    <div className={`sq-text-column-links-default ${className}`}>
      <div className={`sq-text-column-links-default__root ${classes.root}`}>
        <div className="sq-text-column-links-default__wrapper">
          {items &&
            items.map((item, idx) => {
              return (
                <div key={idx} className="sq-text-column-links-default__item">
                  <div className="sq-text-column-links-default__cnt">
                    <div className="sq-text-column-links-default__icon">
                      <Icon name={item.iconName} size={item.iconSize} variant={item.iconColor} />
                    </div>
                    <h2 className="sq-text-column-links-default__title">{item.header}</h2>
                    <div className="sq-text-column-links-default__sub-header">{item.subHeader}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

ImageSliderDefault.propTypes = {
  items: PropTypes.array
};

export default ImageSliderDefault;
