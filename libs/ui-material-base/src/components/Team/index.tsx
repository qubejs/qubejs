import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import Icon from '../Icon';

import './_team.scss';

const ContentTeam = ({ header, className = '', items = [] }:any) => {
  return (
    <div className={`sq-content-team ${className}`}>
      {header && <h2>{header}</h2>}
      <div className="sq-content-team__container">
        {items?.map((item) => {
          return (
            <div className="sq-content-team__item">
              {item.profilePic && (
                <div className="sq-content-team__picture">
                  {
                    <img
                      src={item.profilePic}
                      alt={'picture'}
                    />
                  }
                </div>
              )}
              <div className="sq-content-team__text">
                <div className="sq-content-team__header">{item.header}</div>
                <div className="sq-content-team__designation text-center mb-wide">{item.designation}</div>
                {item.subHeader && <div className="sq-content-team__subheader">{item.subHeader}</div>}
                {item.links && item.links.map && (
                  <div className="sq-content-team__links">
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
    </div>
  );
};
ContentTeam.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  fields: PropTypes.array,
  row: PropTypes.object,
  tag: PropTypes.string,
};

export default ContentTeam;
