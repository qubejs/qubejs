import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Default from './templates/default';
import WithoutImage from './templates/without-image';
import WithBackground from './templates/with-background';
import LargeBackground from './templates/large-background';

const templates = {
  'without-image': WithoutImage,
  default: Default,
  'with-background': WithBackground,
  'large-background': LargeBackground,
};
const HeroContent = ({
  template = 'default',
  templateClassName = '',
  className = '',
  ...rest
}) => {
  const TemplateToRender = templates[template] || templates.default;
  return (
    <div className={`sq-hero-content ${className}`}>
      <TemplateToRender {...rest} className={templateClassName} />
    </div>
  );
};

HeroContent.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  subHeader: PropTypes.string,
};

export default HeroContent;
export { templates };
