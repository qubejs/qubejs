import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Default from './templates/default';
import BoxStyle from './templates/box-style';

const templates = {
  default: Default,
  'box-style': BoxStyle,
};

const Pricing = ({ eyebrow, template = 'default', header, headerTag = 'h1', bodyTag = 'div', subHeader, className = '', ...rest }) => {
  const TemplateToRender = templates[template] || templates.default;
  const containerEl = useRef(null);
  return (
    <div className={`sq-pricing ${className}`} ref={containerEl}>
      <TemplateToRender
        {...{
          eyebrow,
          header,
          subHeader,
          headerTag,
          bodyTag,
        }}
        {...rest}
      />
    </div>
  );
};

Pricing.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  subHeader: PropTypes.string,
};

export default Pricing;
