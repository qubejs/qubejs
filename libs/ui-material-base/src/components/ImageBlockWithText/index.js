import React from 'react';
import PropTypes from 'prop-types';
import HTML from '../HTML';
import LinkButton from '../LinkButton';

import './_image-block-with-text.scss';

const ImageBlockWithText = ({ imageUrl, header, subHeader, className = '', links = [], styleName = 'default' }) => {
  return (
    <div className={`sq-image-block-with-text ${className} sq-image-block-with-text--style-${styleName}`}>
      <div className="sq-image-block-with-text__container">
        <div
          className="sq-image-block-with-text__image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="sq-image-block-with-text__text">
          <div className="sq-image-block-with-text__text-cnt">
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
