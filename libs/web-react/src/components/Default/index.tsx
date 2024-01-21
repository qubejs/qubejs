import common from '../../utils/common';
import PropTypes from 'prop-types';
import './_default.scss';

const BasiText = ({ className = '', value, defaultText = '(blank)' }: any) => {
  const processedText = common.isNullOrUndefinedBlank(value) ? defaultText : '';
  return (
    <div className={`sq-default ${className}`}>
      {value.toString() || <span className='text-muted'>{processedText}</span>}
    </div>
  );
};
BasiText.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
};

export default BasiText;
