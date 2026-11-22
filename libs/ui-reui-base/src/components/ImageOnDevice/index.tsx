import PropTypes from 'prop-types';
import imageIphone from '../../assets/img/iPhone.png';
import imageIphone11 from '../../assets/img/iPhone-11.png';
import imageIpad from '../../assets/img/iPad.png';
import { cordova } from '@qubejs/web-react';
const { resolveImageUrl } = cordova;

const imageMap = {
  iphone: imageIphone,
  iphone11: imageIphone11,
  ipad: imageIpad,
  'ipad-a': imageIpad,
};

Object.keys((i) => {
  const img = new Image();
  img.src = imageMap[i];
});

const ImageOnDevice = ({
  src,
  images,
  device = 'iphone11',
  overlayImage,
  className = '',
}: any) => {
  return (
    <div
      className={`sq-image-on-device sq-image-on-device--${device} ${className}`}
    >
      <div className="sq-image-on-device__overlay">
        <img src={resolveImageUrl(overlayImage || imageMap[device])} />
        <div className="sq-image-on-device__screen">
          {src && <img className={`image-0`} src={resolveImageUrl(src)} />}
          {images &&
            images.map((img, idx) => {
              return (
                <img
                  key={'img' + idx}
                  className={`image-${idx}`}
                  src={resolveImageUrl(img)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

ImageOnDevice.propTypes = {
  className: PropTypes.string,
  images: PropTypes.array,
};

export default ImageOnDevice;
