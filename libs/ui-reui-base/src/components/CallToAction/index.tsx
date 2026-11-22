import PropTypes from 'prop-types';
import defaultTemplate from './templates/default';
import fullBgTemplate from './templates/full-bg';

const templates = {
  default: defaultTemplate,
  'full-bg': fullBgTemplate
};


const CallToAction = ({ header = '', body = '', className = '', links = [], imageUrl = '', template = 'default' }) => {
  const TemplateToRender = templates[template] || templates.default;
  return (<div className={`sq-callto-action sq-callto-action--${template} ${className}`}>
    <TemplateToRender
      header={header}
      body={body}
      links={links}
      imageUrl={imageUrl}
    />
  </div>);
};
CallToAction.propTypes = {
  className: PropTypes.string,
  header: PropTypes.string,
  body: PropTypes.string,
  imageUrl: PropTypes.string,
  template: PropTypes.string,
  links: PropTypes.array
};

export default CallToAction;