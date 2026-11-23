import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../daisy/ui/carousel';
import { cn } from '../../daisy/lib/utils';
import DefaultTemplate from './templates/default';
import FullBgTemplate from './templates/full-bg';

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
}: any) => {
  interval = interval * 1;
  const TemplateToRender = templates[template] || templates.default;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // autoplay (react-material-ui-carousel's `interval`)
  useEffect(() => {
    if (!api || !interval || items.length < 2) return;
    const timer = setInterval(() => api.scrollNext(), interval);
    return () => clearInterval(timer);
  }, [api, interval, items.length, current]);

  return (
    <div className={`sq-carousel ${className} sq-carousel--${template}`}>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className={cn('sq-carousel__carousel', carouselClassName, `sq-carousel--animation-${animation}`)}
      >
        <CarouselContent className="ml-0">
          {items.map((item, i) => (
            <CarouselItem key={i} className="sq-carousel__item pl-0">
              <TemplateToRender {...rest} data={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* MUI version hid nav buttons when navButtonsAlwaysVisible was set (it passed both flags) */}
        {!navButtonsAlwaysVisible && items.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      {items.length > 1 && (
        <div className="sq-carousel__indicator-container mt-3 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              className={cn(
                'size-2 cursor-pointer rounded-full border-0 p-0 transition-colors',
                i === current ? 'bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
              )}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      )}
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
