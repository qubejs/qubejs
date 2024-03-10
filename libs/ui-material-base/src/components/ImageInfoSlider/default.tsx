import React from 'react';
import PropTypes from 'prop-types';
import { cordova } from '@qubejs/web-react';
import Loading from '../Loading';

const { resolveImageUrl } = cordova;
const Carousel = React.lazy(() => import('react-material-ui-carousel'));

const ImageSliderDefault = ({ className = '', items, interval = 5000, animation = 'slide', classes = {} }: any) => {
  return (
    <div className={`sq-image-info-slider__template sq-iis-tmp-default ${className}`}>
      <div className={`sq-image-info-slider__root ${classes.root}`}>
        <React.Suspense fallback={<Loading />}>
          <Carousel interval={interval} animation={animation}>
            {items &&
              items.map((item, idx) => {
                const { classes = {} } = item;
                return (
                  <div key={idx} className={`sq-iis-tmp-default__list-item ${classes.root || ''}`}>
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
              })}
          </Carousel>
        </React.Suspense>
      </div>
    </div>
  );
};

ImageSliderDefault.propTypes = {
  items: PropTypes.array
};

export default ImageSliderDefault;
