import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Icon from '../Icon';
import TagLabel from '../TagLabel';

function TagDropdown({ disabled, value, anchorOrigin = {}, transformOrigin = {}, textField = 'text', valueField = 'value', defaultText = 'Select', options = [], className = '', onChange, ...rest }: any) {
  const _onChange = (item, popupState) => {
    !disabled &&
      onChange &&
      onChange({
        value: item[valueField],
      });
    popupState?.close && popupState.close();
  };

  const valueOption = options.filter((i) => i[valueField] === value);
  const valueFound = valueOption.length > 0 ? valueOption[0] : {};

  return (
    <div className={`sq-tag-dropdown ${className}`}>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <>
              <div className="sq-tag-dropdown__wrapper" {...(!disabled ? bindTrigger(popupState) : {})}>
                <TagLabel {...rest} {...valueFound} value={valueFound[textField] || value || '--'} disabled={disabled}></TagLabel>
                <Icon className={`sq-tag-dropdown__icon ${popupState.isOpen ? 'active' : ''}`} size="xs" name="arrow-down" />
              </div>
              <Menu
                className="sq-tag-dropdown__menu"
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    boxShadow: '0px 4px 16px rgba(25, 25, 25, 0.12)',
                    borderRadius: '8px',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                  ...anchorOrigin,
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                  ...transformOrigin,
                }}
                {...bindMenu(popupState)}
              >
                {options.map((option) => {
                  return (
                    <MenuItem disabled={option.disabled || disabled} className="sq-tag-label--list-item-wrap" onClick={() => _onChange(option, popupState)} key={option[valueField]}>
                      {<TagLabel {...option} className={`sq-tag-label--list-item ${option.className}`} value={option[textField]}></TagLabel>}
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          )}
        </PopupState>
      </Box>
    </div>
  );
}

TagDropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  row: PropTypes.object,
  anchorOrigin: PropTypes.object,
  transformOrigin: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  textField: PropTypes.string,
  valueField: PropTypes.string,
};

export default TagDropdown;
