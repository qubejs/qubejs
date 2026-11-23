import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../Dialog';
import Icon from '../Icon';
import { Button } from '../../daisy/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../daisy/ui/dropdown-menu';
import { Tooltip } from '../../daisy/compat/tooltip';
import LeftDrawer from './LeftDrawer';
import { hasActive, hasPermission } from './helpers';

const LeftNavigation = ({
  logo = {},
  items = [],
  onClick,
  permissions = [],
  roles = [],
  rightItems,
  openDrawer = false,
  onCloseDrawer,
  userData = {},
}: any) => {
  // index of the nav item whose sub-menu is open
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const handleClick = (event, item) => {
    if (!(item.children?.length > 0)) {
      onClick && onClick(item);
    }
  };
  const handleClose = () => {
    setOpenIdx(null);
  };
  const handleDialogClose = () => {
    onCloseDrawer && onCloseDrawer();
  };

  const handleItemClick = (item) => {
    onClick && onClick(item);
    handleClose();
    openDrawer && handleDialogClose();
  };

  return (
    <>
      <Dialog
        transitionDir={'right'}
        title={
          logo && (
            <div className="sq-global-left-navigation__logo">
              {logo.mobileName && <Icon name={logo.mobileName} size="auto" />}
              {logo.mobileImage && (
                <img src={logo.mobileImage} alt={logo.mobileAlt} />
              )}
            </div>
          )
        }
        classes={{
          dialog: {
            root: 'sq-dialog--fixed-menu-left',
          },
        }}
        open={openDrawer}
        onClose={handleDialogClose}
      >
        <LeftDrawer
          items={items}
          rightItems={rightItems}
          permissions={permissions}
          onClick={handleItemClick}
        />
      </Dialog>
      <div className="sq-global-left-navigation">
        {logo && (
          <div className="sq-global-left-navigation__logo">
            {logo.leftName && <Icon name={logo.leftName} />}
            {logo.image && <img src={logo.image} alt={logo.alt} />}
          </div>
        )}
        <div className="sq-global-left-navigation__nav-container">
          {items.map((item, idx) => {
            const isAllowed = hasPermission(item, { permissions, roles });
            if (!isAllowed) {
              return undefined;
            }
            const hasChildren = item.children?.length > 0;
            const button = (
              <Button
                variant="ghost"
                size="icon"
                aria-label={item.tooltip || item.title}
                onClick={(e) => handleClick(e, item)}
              >
                {item.rootIcon && <Icon name={item.rootIcon} />}
                {!item.rootIcon && <Icon name={item.iconName} />}
                {hasChildren && (
                  <div className="sq-global-left-navigation__extend-wrapper">
                    <div className="sq-global-left-navigation__nav-extend"></div>
                  </div>
                )}
              </Button>
            );
            return (
              <div
                key={idx}
                className={`sq-global-left-navigation__nav-item ${
                  hasActive(item, userData) ? 'active' : ''
                }`}
              >
                {!hasChildren && <Tooltip title={item.tooltip || item.title}>{button}</Tooltip>}
                {hasChildren && (
                  <DropdownMenu open={openIdx === idx} onOpenChange={(next) => setOpenIdx(next ? idx : null)}>
                    <Tooltip title={item.tooltip || item.title}>
                      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
                    </Tooltip>
                    <DropdownMenuContent side="right" align="start" sideOffset={10} className="sq-global-left-navigation__menu min-w-48">
                      {item.header && (
                        <DropdownMenuLabel className="sq-global-left-navigation__menu-header">
                          {item.header}
                        </DropdownMenuLabel>
                      )}
                      <DropdownMenuSeparator />
                      {renderMenuItem(item, -1, handleItemClick, { permissions, roles }, false)}
                      {renderMenuItems(item.children, handleItemClick, { permissions, roles }, false)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const renderMenuItems = (items, click, options, children) => {
  return items.map((item, idx) => {
    return renderMenuItem(item, idx, click, options, children);
  });
};

const renderMenuItem = (item, idx, click, options, children) => {
  const isActive = hasActive(item, false);
  const isAllowed = hasPermission(item, options, children);
  if (!isAllowed || item.hideInMenu || !item.href) {
    return undefined;
  }
  return (
    <DropdownMenuItem
      data-active={isActive || undefined}
      className={isActive ? 'active bg-muted' : ''}
      key={idx}
      onSelect={() => click(item)}
    >
      {item.iconName && <Icon name={item.iconName} />}
      {item.title}
    </DropdownMenuItem>
  );
};

LeftNavigation.propTypes = {
  items: PropTypes.array,
  className: PropTypes.string,
  permissions: PropTypes.array,
  roles: PropTypes.array,
  openDrawer: PropTypes.bool,
  onClick: PropTypes.func,
  onCloseDrawer: PropTypes.func,
  logo: PropTypes.object,
};
export default LeftNavigation;
