import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Icon';
import Link from '../../Link';
import { resolveImageUrl } from '../../../cordova';
import { redirectTo } from '../../../utils/redirect';

const TemplateDefault = ({ items, itemClassName, onAnalytics }) => {
  return (
    <div className="sq-fc-template sq-fc-with-bg">
      {items &&
        items.map((item, idx) => {
          const HeaderTag = item.headerTag || 'h1';
          const { href, analytics = {}, ...restHref } = item.link;
          const { click: clickAnalytics } = analytics;
          return (
            <div
              key={idx}
              className={`sq-fc-template sq-fc-with-bg-item `}
              onClick={() => {
                clickAnalytics && onAnalytics && onAnalytics(clickAnalytics);
                redirectTo(href, {}, restHref);
              }}
            >
              <div className="sq-fc-with-bg-item__wrap">
                <div className="sq-fc-with-bg-item__wrapper" style={{ backgroundImage: `url(${resolveImageUrl(item.imageUrl)})` }}></div>
                <div className="sq-fc-with-bg-item__text-wrapper-bg"></div>
                <div className="sq-fc-with-bg-item__text-wrapper">
                  <HeaderTag className="sq-fc-with-bg-item__title">{item.title}</HeaderTag>
                  <div className="sq-fc-with-bg-item__description">{item.description}</div>
                  {item.iconName && (
                    <div className="sq-fc-with-bg-item__icon">
                      <Icon name={item.iconName} size="large" />
                    </div>
                  )}
                  <div className="sq-fc-with-bg-item__links">
                    {item.links &&
                      item.links.map((link, key) => {
                        return <Link key={key} {...link} />;
                      })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

TemplateDefault.propTypes = {
  items: PropTypes.array,
  itemClassName: PropTypes.string
};

export default TemplateDefault;
