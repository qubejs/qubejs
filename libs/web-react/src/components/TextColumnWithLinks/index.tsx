import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Default from './default';

const templates = {
  default: Default
};

const ImageInfoSlider = ({ items, template, style = '3-cols', className = '', ...rest }:any) => {
  const TemplateToRender = templates[template] || templates.default;
  const containerEl = useRef(null);
  return (
    <div className={`sq-text-column-links ${className} ${style ? `sq-text-column-links--${style}` : ''}`} ref={containerEl}>
      <TemplateToRender
        {...{
          items
        }}
        {...rest}
      />
    </div>
  );
};

ImageInfoSlider.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array
};

export default ImageInfoSlider;
