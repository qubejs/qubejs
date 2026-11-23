import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
import { Button } from '../../daisy/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../daisy/ui/dropdown-menu';
import Icon from '../Icon';
import Dialog from '../Dialog';

const { getValue } = utils.properties;

const MoreActions = ({
  actions = [],
  className = '',
  onClick,
  onAction,
  iconColor,
  row,
  column,
  beforeRender,
  onAnalytics,
}: any) => {
  const [confirmAction, setConfirmAction] = useState(null);
  const handleOnClick = (event, action) => {
    const { analytics = {} } = action;
    const { click } = analytics;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setAnchorEl(null);
    if (action.confirm) {
      setConfirmAction(action);
      return;
    }
    onClick && onClick(action);
    onAction && onAction(event, action);
    onAnalytics && click && onAnalytics(click);
    setAnchorEl(null);
  };
  const handleAction = (dialogAction, action) => {
    const { analytics = {} } = action;
    const { click, dialog } = analytics;
    onAnalytics && dialog && onAnalytics(dialog);
    if (dialogAction.action === 'ok') {
      onClick && onClick(action);
      onAction && onAction(dialogAction, action);
      onAnalytics && click && onAnalytics(click);
    }
    setTimeout(() => {
      setConfirmAction(null);
      handleClose();
    });
  };
  const [open, setOpen] = React.useState(false);
  // kept for parity with the MUI version (menu anchor), now just open/close
  const setAnchorEl = (anchor) => setOpen(Boolean(anchor));
  const handleClose = () => setOpen(false);

  const finalActions = getValue(this, actions, row, column) || [];
  let result = true;
  if (beforeRender) {
    result = beforeRender && beforeRender(actions, column, row);
  }
  if (!result) {
    return <></>;
  }

  return (
    <div className={`sq-more-actions ${className}`}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="more"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="more" variant={iconColor} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[20ch] min-w-[100px]">
          {finalActions.map((action, idx) => {
            const disabled = getValue(this, action.disabled, row) || undefined;
            const result = getValue(this, action.render, row);
            const render = result !== false ? true : false;
            if (!render) {
              return undefined;
            }
            return (
              <DropdownMenuItem
                key={idx}
                disabled={disabled}
                onClick={(event) => handleOnClick(event, action)}
              >
                {action.iconName && (
                  <Icon
                    size="small"
                    className="sq-more-actions__icon"
                    variant={action.iconColor || action.iconVariant}
                    name={action.iconName}
                  />
                )}
                {action.buttonText}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {confirmAction?.confirm && (
        <Dialog
          title={confirmAction.confirm.title}
          content={confirmAction.confirm.content}
          classes={{
            body: 'sq-dialog__content-body--confirm',
          }}
          closeButton={false}
          open={confirmAction}
          onAction={(data, dialogAction) => handleAction(dialogAction, confirmAction)}
          actions={[
            {
              buttonText: 'Yes',
              action: 'ok',
            },
            {
              buttonText: 'Cancel',
              variant: 'outlined',
              action: 'cancel',
            },
          ]}
        />
      )}
    </div>
  );
};

MoreActions.propTypes = {
  className: PropTypes.string,
  row: PropTypes.object,
  column: PropTypes.object,
  onClick: PropTypes.func,
  onAction: PropTypes.func,
  actions: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
};

export default MoreActions;
