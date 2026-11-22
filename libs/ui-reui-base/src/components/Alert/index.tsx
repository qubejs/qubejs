import React from 'react';
import PropTypes from 'prop-types';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { Alert as ReuiAlert, AlertDescription, AlertTitle } from '../../reui/ui/alert';
import { toReuiAlertVariant } from '../../reui/compat/mui-props';

const errorMapping = {
  info: {
    icon: Info,
    alertClass: 'info',
  },
  error: {
    icon: CircleAlert,
    alertClass: 'error',
  },
  success: {
    icon: CircleCheck,
    alertClass: 'success',
  },
  warning: {
    icon: TriangleAlert,
    alertClass: 'warning',
  },
};

const Alert = ({ className = '', message = '', header = '', type = 'info', variant, color }: any) => {
  const mapping = errorMapping[type] || errorMapping.info;
  const AlertIcon = mapping.icon;
  return (
    <div className={`sq-alert ${className} sq-alert-${mapping.alertClass}`}>
      <ReuiAlert
        variant={toReuiAlertVariant(color || type) as any}
        className={variant ? `sq-alert--${variant}` : undefined}
      >
        <AlertIcon />
        {header && <AlertTitle>{header}</AlertTitle>}
        {message && <AlertDescription>{message}</AlertDescription>}
      </ReuiAlert>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  header: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
};

export default Alert;
