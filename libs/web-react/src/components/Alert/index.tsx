import React from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@mui/lab/Alert';
import AlertTitle from '@mui/lab/AlertTitle';

const errorMapping = {
  info: {
    icon: 'info',
    alertClass: 'info'
  },
  error: {
    icon: 'error',
    alertClass: 'error'
  },
  success: {
    icon: 'success',
    alertClass: 'success'
  },
  warning: {
    icon: 'warning',
    alertClass: 'warning'
  }
};

const Alert = ({ className = '', message = '', header = '', type = 'info', variant, color }:any) => {
  const mapping = errorMapping[type] || errorMapping.info;
  return (
    <div className={`sq-alert ${className} sq-alert-${mapping.alertClass}`}>
      <MuiAlert severity={type} color={color} variant={variant}>
        {header && <AlertTitle>{header}</AlertTitle>}
        {message}
      </MuiAlert>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  header: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string
};

export default Alert;
