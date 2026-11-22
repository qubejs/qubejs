import PropTypes from 'prop-types';

const LabelValue = ({ label = '', value = '', className = '' }: any) => {
  return (
    <div className={`sq-label-value ${className}`}>
      <div className="sq-label-value__label">{label}</div>
      <div className="sq-label-value__value">{value}</div>
    </div>
  );
};

LabelValue.propTypes = {
  data: PropTypes.object,
  label: PropTypes.string
};

export default LabelValue;
