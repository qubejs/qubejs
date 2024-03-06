import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Button from '../Button';
import LinkButton from '../LinkButton';
import Dialog from '../Dialog';
import useSticky from './useSticky';
import { utils, cordova } from '@qubejs/web-react';
import { hasPermission, hasActive } from '../LeftNavigation/helpers';
import LeftDrawer from '../LeftNavigation/LeftDrawer';
import UserMenu from '../UserMenu';

const { resolveImageUrl } = cordova;
const { redirectTo } = utils.redirect;

const renderSubNav = (item, isHover, callback, options) => {
  const iconName = !isHover ? 'expand' : 'collapse';
  return (
    item.children &&
    item.children.filter(
      (i) => !i.hideInMenu && hasPermission(i, options, false)
    ).length > 0 && (
      <>
        {iconName && (
          <Icon className="sq-global-navigation__list-icon" name={iconName} />
        )}
        <ul className="sq-global-navigation__item-list">
          {item.children.map((child, idx) => {
            const isAllowed = hasPermission(child, options, false);
            if (!isAllowed) {
              return;
            }
            return (
              <li key={idx} className="sq-global-navigation__list-item">
                <LinkButton
                  buttonText={child.title}
                  className="sq-global-navigation__link"
                  {...child}
                  to={child.href}
                  urlParams={child.params}
                  {...child.options}
                  onClick={(e) => {
                    callback && callback();
                  }}
                />
              </li>
            );
          })}
        </ul>
      </>
    )
  );
};


const GlobalNavigation = ({
  items,
  classes = {},
  className = '',
  logo = {},
  rightItems,
  mobileItems,
  onAnalytics,
  navPosition = 'sticky',
  placeHolderspace = false,
  permissions = [],
  roles = [],
  user,
}: any) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const fillerEl = React.useRef<HTMLInputElement>(null)
  const [currentItemHover, setCurrentHover] = useState(null);
  const { isSticky, element } = useSticky();
  useEffect(() => {
    setHeight(element.current.getBoundingClientRect().height);
  });
  const toggleMenu = () => {
    setOpen(!open);
  };
  const handleAction = (item) => {
    redirectTo(item.href || item.to, { ...item.params }, { ...item.options });
  };
  const linksComps = { Button, LinkButton };
  const finalSticky = navPosition === 'sticky' && isSticky;
  const finalFixed = navPosition === 'fixed';
  return (
    <Fragment>
      {(finalSticky || placeHolderspace) && (
        <div
          className="sq-global-navigation-filler"
          style={{ height: height }}
          ref={fillerEl}
        ></div>
      )}
      <Dialog
        transitionDir={'right'}
        title={
          logo && (
            <div className="sq-global-navigation__brand">
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
        open={open}
        onClose={toggleMenu}
      >
        <LeftDrawer
          items={items}
          permissions={permissions}
          rightItems={rightItems}
          onClick={(item) => {
            handleAction(item);
            setOpen(false);
          }}
          roles={roles}
          logo={logo}
        />
      </Dialog>
      <nav
        className={`sq-global-navigation ${className} ${
          finalFixed ? 'sq-global-navigation--fixed' : ''
        } ${finalSticky ? 'sq-global-navigation--sticky' : ''} ${
          open ? 'sq-global-navigation--open' : ''
        }`}
        ref={element}
      >
        <div
          className={`sq-global-navigation__wrapper ${classes.wrapper || ''}`}
        >
          {items && items.length > 0 && (
            <button
              className="sq-global-navigation__toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={toggleMenu}
            >
              <span className={`sq-global-navigation__icon ${logo.className}`}>
                <Icon name="Menu" variant={logo.variant} size="large" />
              </span>
            </button>
          )}
          <a
            className={`sq-global-navigation__brand ${logo.className}`}
            onClick={(e) => {
              if (e.defaultPrevented) return; // Exits here if event has been handled
              e.preventDefault();
              redirectTo(logo.href, { ...logo.params }, { ...logo.options });
              setOpen(false);
            }}
          >
            {logo.name && (
              <Icon
                name={logo.name}
                svg={logo.svg}
                variant={logo.variant}
                size={`${logo.size || 'large'}`}
              />
            )}
            {logo.img && (
              <img
                className={`${logo.size || ''}`}
                src={`${resolveImageUrl(logo.img)}`}
                alt={logo.imgAlt}
              />
            )}
            <div className="sq-global-navigation__brand-text">{logo.text}</div>
          </a>
          <ul className="sq-global-navigation__nav sq-global-navigation__nav--left">
            {mobileItems &&
              mobileItems.map((ritem, idx) => {
                const Comp = linksComps.LinkButton;
                if (ritem === 'UserMenu') {
                  return (
                    <UserMenu
                      key={idx}
                      listOfActions={rightItems}
                      user={user}
                      onAction={handleAction}
                      permissions={permissions}
                    />
                  );
                }
                return idx === 0 ? (
                  <li key={idx}>
                    <Comp
                      {...ritem}
                      onAnalytics={onAnalytics}
                      onClick={() => {
                        setOpen(false);
                      }}
                    />
                  </li>
                ) : null;
              })}
          </ul>
          <div className={`sq-global-navigation__container`}>
            <ul className="sq-global-navigation__nav">
              {items &&
                items.map((linkItem: any, idx: number) => {
                  const isHover = linkItem === currentItemHover;
                  const isActive = hasActive(linkItem);
                  const isAllowed = hasPermission(linkItem, {
                    permissions,
                    roles,
                  });
                  if (!isAllowed) {
                    return;
                  }

                  return (
                    <li
                      key={idx}
                      className={`sq-global-navigation__item ${
                        isHover ? 'sq-global-navigation__item--hover' : ''
                      } ${
                        isActive ? 'sq-global-navigation__item--active' : ''
                      }`}
                      onMouseOver={() => {
                        setCurrentHover(linkItem);
                      }}
                      onMouseOut={() => {
                        setCurrentHover(null);
                      }}
                    >
                      <div className="sq-global-navigation__item-wrapper">
                        <LinkButton
                          buttonText={linkItem.title}
                          className="sq-global-navigation__link"
                          {...linkItem}
                          iconName={undefined}
                          to={linkItem.href}
                          urlParams={linkItem.params}
                          {...linkItem.options}
                          onClick={(e) => {
                            setOpen(false);
                          }}
                        />
                        {renderSubNav(
                          linkItem,
                          isHover,
                          () => {
                            setCurrentHover(null);
                            setOpen(false);
                          },
                          { permissions, roles }
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
            <ul className="sq-global-navigation__nav sq-global-navigation__nav--right">
              {user && (
                <UserMenu
                  listOfActions={rightItems}
                  user={user}
                  onAction={handleAction}
                  permissions={permissions}
                />
              )}
              {!user &&
                rightItems &&
                rightItems.map((ritem, idx) => {
                  const Comp = linksComps.LinkButton;
                  return (
                    <li key={idx}>
                      <Comp
                        {...ritem}
                        onAnalytics={onAnalytics}
                        onClick={() => {
                          setOpen(false);
                        }}
                      />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

GlobalNavigation.propTypes = {
  className: PropTypes.string,
  logo: PropTypes.object,
  items: PropTypes.array,
};

export default GlobalNavigation;
