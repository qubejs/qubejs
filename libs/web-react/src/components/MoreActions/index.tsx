import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Icon from '../Icon';
import Dialog from '../Dialog';

import { getValue } from '../../utils/properties';

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

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
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Icon name="more" variant={iconColor} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: '20ch',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.22))',
            minWidth: 100,
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        {finalActions.map((action, idx) => {
          const disabled = getValue(this, action.disabled, row) || undefined;
          const result = getValue(this, action.render, row);
          const render = result !== false ? true : false;
          if (!render) {
            return undefined;
          }
          return (
            <MenuItem
              key={idx}
              disabled={disabled}
              onClick={(event) => handleOnClick(event, action)}
            >
              {action.iconName && (
                <ListItemIcon>
                  <Icon
                    size="small"
                    className="sq-more-actions__icon"
                    variant={action.iconColor || action.iconVariant}
                    name={action.iconName}
                  />
                </ListItemIcon>
              )}
              {action.buttonText}
            </MenuItem>
          );
        })}
      </Menu>
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
