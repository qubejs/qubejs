import React from 'react';
import PropTypes from 'prop-types';
import { CircleAlert, CircleCheck, Info, TriangleAlert, XIcon } from 'lucide-react';
import { Alert, AlertAction, AlertDescription } from '../../daisy/ui/alert';
import { Button } from '../../daisy/ui/button';
import { toAlertVariant } from '../../daisy/compat/mui-props';

const variantIcon = {
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
  info: Info,
};

function PopupMessage(props) {
  const { className = '', message, onClose, variant, ...other }: any = props;
  const Icon = variantIcon[variant] || Info;

  return (
    <Alert
      variant={toAlertVariant(variant) as any}
      className={`sq-popup-message ${className}`}
      aria-describedby="client-snackbar"
      {...other}
    >
      <Icon />
      <AlertDescription id="client-snackbar">{message}</AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-xs" aria-label="Close" onClick={onClose}>
          <XIcon />
        </Button>
      </AlertAction>
    </Alert>
  );
}

PopupMessage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default PopupMessage;
