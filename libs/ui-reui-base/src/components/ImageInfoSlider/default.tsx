import React from 'react';
import PropTypes from 'prop-types';
import { cordova } from '@qubejs/web-react';
import Carousel, { addTemplate } from '../Carousel';

const { resolveImageUrl } = cordova;

// renders each slide through the shared ReUI carousel
const Slide = ({ data: item }: any) => {
  const { classes = {} } = item;
  return (
    <div className={`sq-iis-tmp-default__list-item ${classes.root || ''}`}>
      <div className="sq-iis-tmp-default__list-item-cnt">
        <div className="sq-iis-tmp-default__image">
          <img src={resolveImageUrl(item.imageUrl)} />
        </div>
        <div className="sq-iis-tmp-default__right-content">
          <div className={`sq-iis-tmp-default__banner ${classes.banner || ''}`}>
            <div className="sq-iis-tmp-default__eyebrow">{item.eyebrow}</div>
            <div className="sq-iis-tmp-default__header">{item.header}</div>
            <div className="sq-iis-tmp-default__description">{item.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
addTemplate({ 'image-info-slide': Slide });

const ImageSliderDefault = ({ className = '', items, interval = 5000, animation = 'slide', classes = {} }: any) => {
  return (
    <div className={`sq-image-info-slider__template sq-iis-tmp-default ${className}`}>
      <div className={`sq-image-info-slider__root ${classes.root}`}>
        <Carousel
          items={items || []}
          interval={interval}
          animation={animation}
          template="image-info-slide"
          navButtonsAlwaysVisible={false}
        />
      </div>
    </div>
  );
};

ImageSliderDefault.propTypes = {
  items: PropTypes.array
};

export default ImageSliderDefault;
