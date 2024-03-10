import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import RoundProgress from './round-progress';
import CubeProgress from './cube-progress';
import Ripple from './ripple';

const _types = {
  default: CircularProgress,
  line: LinearProgress,
  cube: CubeProgress,
  round: RoundProgress,
  ripple: Ripple
};

const Progress = ({ type = 'default', style = 'full-screen', text = '', color = 'primary', overlay = true, className = '', overlayStyle = 'default' }) => {
  const CompToRender = _types[type] || _types.default;
  return (
    <div className={`tp-progress ${className} tp-progress--${style}`}>
      <CompToRender className="tp-progress__spinner" color={color} />
      {overlay && style !== 'static' && <div className={`tp-progress__overlay ${overlayStyle}`}></div>}
      {text && <div className="tp-progress__text">{text}</div>}
    </div>
  );
};

Progress.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  text: PropTypes.string
};

export default Progress;
