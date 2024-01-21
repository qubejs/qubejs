import React from 'react';
import PropTypes from 'prop-types';
import { resolveImageUrl } from '../../cordova';
import Icon from '../Icon';


const Image = ({ className = '', alt, imageUrl, size = 'medium', noImage = '', style }) => {
  return (
    <div className={`sq-image sq-image--${size} ${className}`} style={style}>
      {imageUrl && <img alt={alt} src={resolveImageUrl(imageUrl)} />}
      {!imageUrl && noImage && <div className="sq-image__no-image">
        {noImage}
      </div>}
      {!imageUrl && !noImage && <Icon className="sq-image__no-image" name="HideImage" size='large' variant='default' />}
    </div>
  );
};

Image.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string
};

export default Image;
