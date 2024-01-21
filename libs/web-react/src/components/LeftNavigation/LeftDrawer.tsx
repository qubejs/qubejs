import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import { Divider } from '@mui/material';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import Button from '../Button';
import { hasPermission, hasActive } from './index';

const linksComps = {
  Button,
  LinkButton,
};
const LeftDrawer = ({ items = [], onClick, permissions = [], roles = [], openDrawer = false, onCloseDrawer, rightItems = [], onAnalytics }:any) => {
  const [openItems, setOpenItems] = React.useState({});

  const handleDialogClose = () => {
    setOpenItems({});
    onCloseDrawer && onCloseDrawer();
  };

  const handleItemClick = (item) => {
    onClick && onClick(item);
    openDrawer && handleDialogClose();
  };

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav>
          <List>
            {items.map((item, idx) => {
              const isAllowed = hasPermission(item, { permissions, roles });
              if (!isAllowed) {
                return undefined;
              }
              const isActive = hasActive(item);
              const isOpen = openItems[idx] !== undefined ? openItems[idx] : isActive;
              const children = item.children?.filter(i => !i.hideInMenu);
              return (
                <React.Fragment key={idx}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        (!children || children?.length === 0) && handleItemClick(item);
                        setOpenItems({
                          ...openItems,
                          [idx]: !(isOpen || openItems[idx]),
                        });
                      }}
                    >
                      {item.iconName && (
                        <ListItemIcon>
                          {item.rootIcon && <Icon name={item.rootIcon} />}
                          {!item.rootIcon && <Icon name={item.iconName} />}
                        </ListItemIcon>
                      )}
                      <ListItemText primary={item.header || item.title} />
                      {children?.length > 0 ? isOpen ? <Icon name="arrow-up" /> : <Icon name="arrow-down" /> : undefined}
                    </ListItemButton>
                  </ListItem>
                  {children?.length > 0 && (
                    <Collapse
                      in={isOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        component="div"
                        disablePadding
                      >
                        {renderListItem(item, idx, handleItemClick, { permissions, roles }, false)}
                        {item.children.map((subItem, subIdx) => {
                          return renderListItem(subItem, subIdx, handleItemClick, { permissions, roles }, false);
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
            {rightItems &&
              rightItems.map((ritem, idx) => {
                let Comp = linksComps.LinkButton;
                if (ritem === 'divider') {
                  return <Divider />;
                }
                const isAllowed = hasPermission(ritem, { permissions });
                if (!isAllowed) {
                  return;
                }
                return (
                  <ListItem
                    disablePadding
                    key={idx}
                  >
                    <ListItemButton onClick={() => handleItemClick(ritem)}>
                      <ListItemText>
                        <Comp
                          {...ritem}
                          onAnalytics={onAnalytics}
                        />
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </nav>
      </Box>
    </>
  );
};

const renderListItem = (item, idx, click, options, children) => {
  const isActive = hasActive(item, false);
  const isAllowed = hasPermission(item, options, children);
  if (!isAllowed || item.hideInMenu || !item.href) {
    return undefined;
  }
  return (
    <ListItemButton
      selected={isActive}
      key={idx}
      sx={{ pl: 4 }}
      onClick={() => click(item)}
    >
      <ListItemIcon>
        <Icon name={item.iconName} />
      </ListItemIcon>
      <ListItemText primary={item.title} />
    </ListItemButton>
  );
};

LeftDrawer.propTypes = {
  items: PropTypes.array,
  permissions: PropTypes.array,
  rightItems: PropTypes.array,
  roles: PropTypes.array,
  openDrawer: PropTypes.bool,
  onClick: PropTypes.func,
  onCloseDrawer: PropTypes.func,
  logo: PropTypes.object,
};
export default LeftDrawer;
