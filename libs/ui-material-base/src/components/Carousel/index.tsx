import PropTypes from 'prop-types';
import DefaultTemplate from './templates/default';
import FullBgTemplate from './templates/full-bg';
import Carousel from 'react-material-ui-carousel';

let templates = {
  default: DefaultTemplate,
  'full-bg': FullBgTemplate,
};

const addTemplate = (newTemplates) => {
  templates = {
    ...templates,
    ...newTemplates,  
  };
};

const FullCarousel = ({
  carouselClassName = '',
  className = '',
  items = [],
  interval = 5000,
  navButtonsAlwaysVisible = true,
  template = 'default',
  animation = 'fade',
  ...rest
}:any) => {
  interval = interval * 1;
  const TemplateToRender = templates[template] || templates.default;
  return (
    <div className={`sq-carousel ${className} sq-carousel--${template}`}>
      <Carousel
        indicatorContainerProps={{
          className: 'sq-carousel__indicator-container',
        }}
        className={carouselClassName}
        interval={interval}
        navButtonsAlwaysVisible={navButtonsAlwaysVisible}
        animation={animation}
        navButtonsAlwaysInvisible={navButtonsAlwaysVisible}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="sq-carousel__item"
          >
            <TemplateToRender {...rest} data={item} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

FullCarousel.propTypes = {
  className: PropTypes.string,
  carouselClassName: PropTypes.string,
  animation: PropTypes.string,
  template: PropTypes.string,
  interval: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  navButtonsAlwaysVisible: PropTypes.bool,
  items: PropTypes.array,
};

export default FullCarousel;
export { addTemplate };
