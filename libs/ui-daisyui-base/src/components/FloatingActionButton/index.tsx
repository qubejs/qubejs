import PropTypes from 'prop-types';
import { Button } from '../../daisy/ui/button';
import { toButtonVariant } from '../../daisy/compat/mui-props';
import Icon from '../Icon';

const SQFloatingActionButton = ({
  className = '',
  label,
  iconName = 'add',
  disabled,
  color = 'primary',
  position = 'bottom-right',
  onClick,
  analytics = {},
  onAnalytics,
  size,
}: any) => {
  const handleClick = (e) => {
    const { click }: any = analytics;
    onClick && onClick(e);
    click && onAnalytics(click);
  };

  return (
    <Button
      className={`sq-fab-button ${className} ${position} size-14 rounded-full shadow-lg`}
      variant={toButtonVariant('contained', color)}
      size="icon-lg"
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
    >
      {<Icon name={iconName} size={size} variant="white" />}
    </Button>
  );
};

SQFloatingActionButton.propTypes = {
  buttonText: PropTypes.string,
  className: PropTypes.string,
  onAnalytics: PropTypes.func,
  onClick: PropTypes.func,
};

export default SQFloatingActionButton;
