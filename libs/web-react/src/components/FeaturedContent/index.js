import React from 'react';
import PropTypes from 'prop-types';
import Default from './templates/default';
import WithBackground from './templates/with-bg';

const templates = {
  default: Default,
  'with-bg': WithBackground
};

const HeroContent = ({ items, className, itemClassName, template = 'default', analytics, onAnalytics }) => {
  const TemplateToRender = templates[template] || templates.default;
  return (
    <div className={`sq-featured-content sq-featured-content--${template} ${className}`}>
      <div className="sq-featured-content__wrapper">
        <TemplateToRender
          {...{
            className,
            itemClassName,
            template,
            items,
            analytics,
            onAnalytics
          }}
        />
      </div>
    </div>
  );
};

HeroContent.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  template: PropTypes.string
};

export default HeroContent;
