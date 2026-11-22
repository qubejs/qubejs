import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ImageWithSlide from '../ImageWithSlide';

import HeroContent from '../HeroContent';

const ImageWithSlideList = ({ items = [], className = '', classes = {}, header, floatHeader = true }:any) => {
  const { slide: slideClassName = 'slide', item: itemClassName = '' }:any = classes;
  return (
    <div className={`sq-image-with-slide-list ${className}`}>
      {header && <HeroContent className={`${classes.header}${floatHeader ? ' sq-image-with-slide-list__header' :''}`} header={header} />}
      {items &&
        items.map((item, idx) => {
          const { className, ...restItem } = item;
          return (
            <div key={`${slideClassName}${idx}`} className={`${className} ${itemClassName} ${slideClassName}-${idx + 1}`}>
              <ImageWithSlide {...restItem} />
            </div>
          );
        })}
    </div>
  );
};

ImageWithSlideList.propTypes = {
  className: PropTypes.string
};

export default ImageWithSlideList;
