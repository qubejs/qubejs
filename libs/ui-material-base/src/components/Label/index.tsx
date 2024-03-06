import PropTypes from 'prop-types';


const LabelField = ({ value, className, dom = {} }: any) => {
  return (<label className={`${className}`} {...dom} >{value}</label>);
};
LabelField.propTypes = {
  children:PropTypes.node,
  className:PropTypes.string
};

export default LabelField;