import PropTypes from 'prop-types';
import { utils, cordova } from '@qubejs/web-react';
import ImageOnDevice from '../ImageOnDevice';
const common = utils.common;
const { resolveImageUrl } = cordova;


const imageMap = {
  img: ({ src, ...rest }) => {
    return <img src={resolveImageUrl(src)} {...rest} />;
  },
  ImageOnDevice
};

const ImageWithSlide = ({ image = {}, align = 'left', className = '', classes = {}, eyebrow, header, headerTag = 'h2', bgColor = '#e2e2e2' }:any) => {
  const HTag = headerTag;
  const { cmpType: imageType = 'img', imageUrl, ...restImage }:any = image;
  const ImageRender = imageMap[imageType] || imageMap.img;
  return (
    <div className={`sq-image-with-slide ${className} sq-image-with-slide--${align}`}>
      <div className="sq-image-with-slide__cnt">
        <div className="sq-image-with-slide__image">
          <ImageRender src={imageUrl} {...restImage} />
        </div>
        <div className={`sq-image-with-slide__panel ${common.toStringBlank(classes.panel)}`}>
          <div className={`sq-image-with-slide__panel-inner  ${common.toStringBlank(classes.innerPanel)}`} style={{backgroundColor: bgColor}} >
            <div className="sq-image-with-slide__eyebrow mb-narrow">{eyebrow}</div>
            <HTag className="sq-image-with-slide__header">{header}</HTag>
          </div>
        </div>
      </div>
    </div>
  );
};

ImageWithSlide.propTypes = {
  className: PropTypes.string
};

export default ImageWithSlide;
