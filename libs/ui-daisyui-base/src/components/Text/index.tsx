import PropTypes from 'prop-types';

const SupportedTags = {
  'span': 'span',
  'div': 'div',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'h5': 'h5',
  'p': 'p'
};

const Text = ({ tag = 'span', parentTag = 'div', className = '', value, text }:any) => {
  const Tag = SupportedTags[tag] || SupportedTags.span;
  const ParentTag = SupportedTags[parentTag] || SupportedTags.div;

  return (
    <ParentTag className={`sq-text ${className}`}>
      <Tag>{value || text}</Tag>
    </ParentTag>
  );
};
Text.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  row: PropTypes.object,
  tag: PropTypes.string,
  parentTag: PropTypes.string
};

export default Text;