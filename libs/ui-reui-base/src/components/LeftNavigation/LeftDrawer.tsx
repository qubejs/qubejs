import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible, CollapsibleContent } from '../../reui/ui/collapsible';
import { Separator } from '../../reui/ui/separator';
import { NavItem } from '../../reui/compat/nav-item';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import Button from '../Button';
import { hasActive, hasPermission } from './helpers';

const NavButton = NavItem;

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
      <div className="w-full max-w-[360px]">
        <nav>
          <div className="flex flex-col gap-0.5">
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
                  <NavButton
                      aria-expanded={children?.length > 0 ? isOpen : undefined}
                      onClick={() => {
                        (!children || children?.length === 0) && handleItemClick(item);
                        setOpenItems({
                          ...openItems,
                          [idx]: !(isOpen || openItems[idx]),
                        });
                      }}
                    >
                      {item.iconName && (
                        <span className="flex shrink-0">
                          {item.rootIcon && <Icon name={item.rootIcon} />}
                          {!item.rootIcon && <Icon name={item.iconName} />}
                        </span>
                      )}
                      <span className="flex-1">{item.header || item.title}</span>
                      {children?.length > 0 ? isOpen ? <Icon name="arrow-up" /> : <Icon name="arrow-down" /> : undefined}
                  </NavButton>
                  {children?.length > 0 && (
                    <Collapsible open={isOpen}>
                      <CollapsibleContent className="flex flex-col gap-0.5">
                        {renderListItem(item, idx, handleItemClick, { permissions, roles }, false)}
                        {item.children.map((subItem, subIdx) => {
                          return renderListItem(subItem, subIdx, handleItemClick, { permissions, roles }, false);
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </React.Fragment>
              );
            })}
            {rightItems &&
              rightItems.map((ritem, idx) => {
                let Comp = linksComps.LinkButton;
                if (ritem === 'divider') {
                  return <Separator key={`divider_${idx}`} className="my-1" />;
                }
                const isAllowed = hasPermission(ritem, { permissions });
                if (!isAllowed) {
                  return;
                }
                return (
                  <NavButton key={idx} onClick={() => handleItemClick(ritem)}>
                    <Comp {...ritem} onAnalytics={onAnalytics} />
                  </NavButton>
                );
              })}
          </div>
        </nav>
      </div>
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
    <NavButton selected={isActive} inset key={idx} onClick={() => click(item)}>
      <Icon name={item.iconName} />
      <span className="flex-1">{item.title}</span>
    </NavButton>
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
