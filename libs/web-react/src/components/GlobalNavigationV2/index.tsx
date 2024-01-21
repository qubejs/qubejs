import React, { useState, useRef, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { resolveImageUrl } from '../../cordova';
import Icon from '../Icon';
import Button from '../Button';
import LinkButton from '../LinkButton';
import { redirectTo } from '../../utils/redirect';
import useSticky from '../GlobalNavigation/useSticky';
import './_global-navigation-v2.scss';

const GlobalNavigationV2 = ({
  items,
  classes = {},
  className = '',
  logo = {},
  rightItems,
  mobileItems,
  onAnalytics,
  navPosition = 'sticky',
}: any) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const fillerEl = useRef();
  const { isSticky, element } = useSticky();
  useEffect(() => {
    if (navPosition === 'sticky') {
      setHeight(element.current.getBoundingClientRect().height);
    }
  });
  const linksComps = { Button, LinkButton };
  const finalSticky = navPosition === 'sticky' && isSticky;
  const finalFixed = navPosition === 'fixed';
  return (
    <Fragment>
      {finalSticky && (
        <nav
          className="sq-global-navigation-v2-filler"
          style={{ height: height }}
          ref={fillerEl}
        ></nav>
      )}
      <nav
        className={`sq-global-navigation-v2 ${className} ${
          finalFixed ? 'sq-global-navigation-v2--fixed' : ''
        } ${finalSticky ? 'sq-global-navigation-v2--sticky' : ''}`}
        ref={element}
      >
        <div
          className={`sq-global-navigation-v2__wrapper ${classes.wrapper || ''}`}
        >
          <a
            className={`sq-global-navigation-v2__brand ${logo.className}`}
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
            {logo.imageUrl && (
              <img
                className={`${logo.size || ''}`}
                src={`${resolveImageUrl(logo.imageUrl)}`}
                alt={logo.imgAlt}
              />
            )}
            <div className="sq-global-navigation-v2__brand-text">{logo.text}</div>
          </a>
          <ul className="sq-global-navigation-v2__nav sq-global-navigation-v2__nav--left">
            {mobileItems &&
              mobileItems.map((ritem, idx) => {
                let Comp = linksComps.LinkButton;
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
         
          <div
            className={`sq-global-navigation-v2__container`}
          >

            <div className="sq-global-navigation-v2__nav">
            {items &&
                items.map((linkItem, idx) => {
                  const isHover = false;
                  const isVisible = !linkItem.hideInMenu;
                  if (!isVisible) {
                    return <></>;
                  }
                  return (
                    <div
                      key={idx}
                      className={`sq-global-navigation-v2__item ${
                        isHover ? 'sq-global-navigation-v2__item--hover' : ''
                      }`}
                     
                    >
                      <div className="sq-global-navigation-v2__item-wrapper">
                        <a
                          onClick={(e) => {
                            if (e.defaultPrevented) return; // Exits here if event has been handled
                            e.preventDefault();
                            redirectTo(
                              linkItem.href,
                              linkItem.params,
                              linkItem.options
                            );
                            setOpen(false);
                          }}
                          href={linkItem.href}
                          className="sq-global-navigation-v2__item-text"
                        >
                          {linkItem.title}
                        </a>
                        
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="sq-global-navigation-v2__nav-right">

            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

GlobalNavigationV2.propTypes = {
  className: PropTypes.string,
  logo: PropTypes.object,
  items: PropTypes.array,
};

export default GlobalNavigationV2;
