import PropTypes from 'prop-types';
import { Spinner } from '../../daisy/ui/spinner';
import { cn } from '../../daisy/lib/utils';
import RoundProgress from './round-progress';
import CubeProgress from './cube-progress';
import Ripple from './ripple';

const SpinnerProgress = ({ className, color }: any) => (
  <Spinner className={cn('dy-loading-lg', color === 'secondary' ? 'text-secondary' : 'text-primary', className)} />
);

// daisyUI progress without a value is indeterminate
const LineProgress = ({ className }: any) => (
  <progress className={cn('dy-progress dy-progress-primary w-full', className)} />
);

const _types = {
  default: SpinnerProgress,
  line: LineProgress,
  cube: CubeProgress,
  round: RoundProgress,
  ripple: Ripple,
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
  text: PropTypes.string,
};

export default Progress;
