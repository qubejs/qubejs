import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Icon';
import Link from '../../Link';

const TemplateDefault = ({ items, itemClassName }) => {
  return (
    <div className="sq-fc-template sq-fc-default">
      {items &&
        items.map((item, idx) => {
          return (
            <div key={idx} className={`sq-fc-template sq-fc-default-item ${itemClassName}`}>
              <div className="sq-fc-default-item__wrapper">
                <div className="sq-fc-default-item__icon">
                  {item.icon && <Icon className='sq-icon--bg-big' variant={item.iconColor || 'secondary'} name={item.icon} size={item.iconSize || "large"} />}
                </div>
                <div className="sq-fc-default-item__title">{item.title}</div>
                <div className="sq-fc-default-item__line"></div>
                <div className="sq-fc-default-item__description">{item.description}</div>
                <div className="sq-fc-default-item__links">
                  {item.links &&
                    item.links.map((link, key) => {
                      return <Link key={key} {...link} />;
                    })}
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
