import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Icon from '../Icon';
import Button from '../Button';

const CustomMenu = ({ disabled, value, defaultText = 'Untitled', type = 'Button', header = 'No header', subHeader = '', options = [], iconName = 'Save', iconSize = 'normal', className = '', title, onAction }: any) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (e, item) => {
    onAction && onAction({ value }, item);
    handleClose();
  };
  return (
    <div className={`sq-custom-menu ${className}`}>
      {
        <Button
          disabled={disabled}
          buttonText={value || defaultText}
          onClick={handleClick}
          variant="outlined"
          iconName={'arrow-down'}
          iconSize={'small'}
          iconDirection="right"
        />
      }
      <Menu
        anchorEl={anchorEl}
        open={open}
        className={`sq-custom-menu__menu`}
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
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <div className="sq-custom-menu__header">
          <div className="sq-custom-menu__user-name">{header}</div>
          {subHeader && <div className="sq-custom-menu__email">{subHeader}</div>}
        </div>
        {options.map((action, key) => {
          if (action === 'divider') {
            return <Divider key={key} />;
          }
          return (
            <MenuItem
              key={key}
              disabled={action.disabled}
              onClick={(e) => handleItemClick(e, action)}
            >
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

export default CustomMenu;
