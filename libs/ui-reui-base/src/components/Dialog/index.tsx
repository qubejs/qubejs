import React from 'react';
import PropTypes from 'prop-types';
import { XIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../reui/ui/dialog';
import { Button } from '../../reui/ui/button';
import { toReuiButtonVariant } from '../../reui/compat/mui-props';
import { cn } from '../../reui/lib/utils';
import Progress from '../Progress';

// MUI's slide transition direction -> tw-animate-css slide-in classes
const transitionOptions = {
  left: 'data-open:slide-in-from-right-8',
  up: 'data-open:slide-in-from-bottom-8',
  right: 'data-open:slide-in-from-left-8',
  bottom: 'data-open:slide-in-from-top-8',
};

const SQDialog = ({
  className = '',
  closeButton = true,
  hideBackdrop = false,
  backDropClick = true,
  disableEscapeKeyDown,
  headerTag,
  transitionDir = 'up',
  classes: overrideClasses = {},
  fullScreen = false,
  open = false,
  isLoading = false,
  title,
  content,
  children,
  onClose,
  actions = [],
  onAction,
}: any) => {
  const handleClose = () => {
    onClose &&
      onClose(
        {
          cancel: true,
        },
        { actionType: 'close' }
      );
  };
  const handleAction = (action) => {
    onAction && onAction({}, action);
  };
  const HeaderTag = headerTag || 'div';
  return (
    <div className={`sq-dialog ${overrideClasses.root || ''}`}>
      <Dialog open={!!open} onOpenChange={(next) => !next && handleClose()}>
        <DialogContent
          showCloseButton={false}
          className={cn(
            'sq-dialog__paper',
            className,
            overrideClasses.dialog?.paper,
            transitionOptions[transitionDir],
            fullScreen
              ? 'h-dvh max-h-dvh w-dvw max-w-none rounded-none sm:max-w-none'
              : 'sm:max-w-lg',
            hideBackdrop && '[&~[data-slot=dialog-overlay]]:bg-transparent'
          )}
          onEscapeKeyDown={(e) => disableEscapeKeyDown && e.preventDefault()}
          onPointerDownOutside={(e) => backDropClick === false && e.preventDefault()}
          onInteractOutside={(e) => backDropClick === false && e.preventDefault()}
        >
          <DialogHeader className="sq-dialog__title pr-8">
            <DialogTitle asChild={!!headerTag}>
              {headerTag ? <HeaderTag>{title}</HeaderTag> : title}
            </DialogTitle>
            {/* Radix requires a description for a11y; content renders below */}
            <DialogDescription className="sr-only">{typeof title === 'string' ? title : 'dialog'}</DialogDescription>
          </DialogHeader>
          {closeButton && (
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="sq-dialog__close absolute top-2 right-2"
                aria-label="close"
              >
                <XIcon />
              </Button>
            </DialogClose>
          )}
          <div className="sq-dialog__content">
            <div className={`sq-dialog__content-body ${overrideClasses.body || ''}`}>
              {isLoading && (
                <div className="sq-dialog__loader">
                  <Progress />
                </div>
              )}
              {content || children}
            </div>
          </div>
          {actions && actions.length > 0 && (
            <DialogFooter className="sq-dialog__actions">
              {actions.map((action, idx) => {
                const {
                  buttonText,
                  variant = 'contained',
                  color = 'primary',
                  className = '',
                } = action;
                return (
                  <Button
                    key={idx}
                    onClick={() => handleAction(action)}
                    variant={toReuiButtonVariant(variant, color)}
                    size="sm"
                    className={className}
                  >
                    {buttonText}
                  </Button>
                );
              })}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
SQDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.any,
  children: PropTypes.any,
  isLoading: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
  backDropClick: PropTypes.bool,
  type: PropTypes.string,
  content: PropTypes.any,
  fullScreen: PropTypes.bool,
  classes: PropTypes.any,
  closeButton: PropTypes.any,
  actions: PropTypes.array,
  transitionDir: PropTypes.string,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};
export default SQDialog;
