import PropTypes from 'prop-types';
import Link from '../Link';
import Icon from '../Icon';

import './_contact-us-info.scss';

const ContactUsInfo = ({ className = '', items = [] }:any) => {
  return (
    <div className={`sq-contact-us-info ${className}`}>
      {items?.map((item) => {
        return (
          <div className="sq-contact-us-info__item">
            {item.iconName && (
              <div className="sq-contact-us-info__icon">
                {
                  <Icon
                    name={item.iconName}
                    variant={item.iconColor}
                    size={item.iconSize || 'large'}
                  />
                }
              </div>
            )}
            <div className="sq-contact-us-info__text">
              <div className="sq-contact-us-info__header">{item.header}</div>
              {item.subHeader && <div className="sq-contact-us-info__subheader">{item.subHeader}</div>}
              {item.links && item.links.map && (
                <div className="sq-contact-us-info__links">
                  {item.links.map((link) => {
                    return <Link {...link} />;
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
ContactUsInfo.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  fields: PropTypes.array,
  row: PropTypes.object,
  tag: PropTypes.string,
};

export default ContactUsInfo;
