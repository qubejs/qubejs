import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Icon from '../Icon';
import { hasPermission } from '../LeftNavigation/helpers';

const UserMenu = ({ user, onAction, listOfActions, buttonClassName = '', className = '', permissions }: any) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (e, item) => {
    onAction && onAction(item);
    handleClose();
  };

  return (
    <div className={`sq-user-menu ${className}`}>
      <Tooltip title={`${user?.firstName} ${user?.lastName}`}>
        <IconButton onClick={handleClick} className={buttonClassName}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.firstName ? user?.firstName?.substr(0, 1).toUpperCase() : 'U'}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        className={`sq-user-menu__menu`}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
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
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className="sq-user-menu__header">
          <div className="sq-user-menu__user-name">
            {`${user?.firstName} ${user?.lastName}`}
          </div>
          <div className="sq-user-menu__email">{`${user?.email}`}</div>
        </div>
        {listOfActions.map((action, key) => {
          if (action === 'divider') {
            return <Divider key={key} />;
          }
          const isAllowed = hasPermission(action, {permissions});
          if (!isAllowed) {
            return;
          }
          return (
            <MenuItem key={key} onClick={(e) => handleItemClick(e, action)}>
              <ListItemIcon>
                <Icon
                  size={action.iconSize}
                  className={action.className}
                  name={action.iconName}
                />
              </ListItemIcon>
              {action.buttonText}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
UserMenu.propTypes = {
  user: PropTypes.object,
  onAction: PropTypes.func,
  listOfActions: PropTypes.array,
  permissions: PropTypes.array,
  className: PropTypes.string
};
export default UserMenu;
