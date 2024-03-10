import PropTypes from 'prop-types';

const Separator = ({ className = '' }: any) => {
  return <div className={`sq-separator-cmp ${className}`}></div>;
};
Separator.propTypes = {
  className: PropTypes.string
};

export default Separator;
