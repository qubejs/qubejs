import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import WarningIcon from '@mui/icons-material/Warning';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

function PopupMessage(props) {
  const classes:any = {};
  const { className, message, onClose, variant, ...other }:any = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={`${classes[variant]} ${className}`}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={`${classes.icon} ${classes.iconVariant}`} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

PopupMessage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
};

export default PopupMessage;