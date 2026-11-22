import PropTypes from 'prop-types';
import { Spinner } from '../../reui/ui/spinner';
import { cn } from '../../reui/lib/utils';
import RoundProgress from './round-progress';
import CubeProgress from './cube-progress';
import Ripple from './ripple';

const SpinnerProgress = ({ className, color }: any) => (
  <Spinner className={cn('size-10', color === 'secondary' ? 'text-secondary-foreground' : 'text-primary', className)} />
);

// indeterminate bar (ReUI Progress is determinate only)
const LineProgress = ({ className }: any) => (
  <div data-slot="progress" role="progressbar" className={cn('relative h-1 w-full overflow-hidden rounded-full bg-muted', className)}>
    <div className="absolute inset-y-0 left-0 w-1/3 animate-[sq-reui-indeterminate_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
  </div>
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
