import React from 'react';
import PropTypes from 'prop-types';
import HTML from '../HTML';
import LinkButton from '../LinkButton';

import './_image-with-header-body.scss';

const ImageBlockWithText = ({ imageUrl, header, subHeader, className = '', links = [], styleName = 'default' }) => {
  return (
    <div className={`sq-image-with-header-body ${className} sq-image-with-header-body--style-${styleName}`}>
      <div className="sq-image-with-header-body__container">
        <div className="sq-image-with-header-body__image">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="picture"
            />
          )}
        </div>
        <div className="sq-image-with-header-body__text">
          <div className="sq-image-with-header-body__text-cnt">
            {header && <h3 className="mb-wide">{header}</h3>}
            {subHeader && (
              <HTML
                className="mb-wide"
                html={subHeader}
              />
            )}
            {links && links.map && (
              <div className="sq-contact-us-info__links">
                {links.map((link) => {
                  return <LinkButton {...link} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
ImageBlockWithText.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  fields: PropTypes.array,
  row: PropTypes.object,
  tag: PropTypes.string,
};

export default ImageBlockWithText;
