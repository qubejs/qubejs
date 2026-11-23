import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { CircleAlert, CircleCheck, Info, TriangleAlert, XIcon } from 'lucide-react';
import { Alert, AlertAction, AlertDescription } from '../../daisy/ui/alert';
import { Button } from '../../daisy/ui/button';
import { toAlertVariant } from '../../daisy/compat/mui-props';
import { cn } from '../../daisy/lib/utils';

const icons = { success: CircleCheck, error: CircleAlert, warning: TriangleAlert, info: Info };

const positionClass = ({ vertical = 'top', horizontal = 'center' }) =>
  cn(
    'fixed z-[1400] w-[min(100vw-2rem,28rem)]',
    vertical === 'top' ? 'top-4' : 'bottom-4',
    horizontal === 'left' ? 'left-4' : horizontal === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'
  );

const SQSnackbar = React.forwardRef(
  (
    {
      open = false,
      message = '',
      autoHideDuration = 4000,
      onClose,
      variant = 'filled',
      severity = 'success',
      anchorOrigin = {},
    }: any,
    ref: any
  ) => {
    useEffect(() => {
      if (!open || !autoHideDuration || !onClose) return;
      const timer = setTimeout(() => onClose(undefined, 'timeout'), autoHideDuration);
      return () => clearTimeout(timer);
    }, [open, autoHideDuration, onClose]);
    if (!open || typeof document === 'undefined') return null;
    const SeverityIcon = icons[severity] || icons.info;
    return createPortal(
      <div ref={ref} role="status" className={cn('sq-snackbar', positionClass(anchorOrigin))}>
        <Alert
          variant={toAlertVariant(severity) as any}
          className={cn('bg-background shadow-lg', variant === 'filled' && 'sq-snackbar--filled')}
        >
          <SeverityIcon />
          <AlertDescription>{message}</AlertDescription>
          <AlertAction>
            <Button variant="ghost" size="icon-xs" aria-label="close" onClick={(e) => onClose && onClose(e, 'close')}>
              <XIcon />
            </Button>
          </AlertAction>
        </Alert>
      </div>,
      document.body
    );
  }
);

SQSnackbar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  severity: PropTypes.string,
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
};

export default SQSnackbar;
