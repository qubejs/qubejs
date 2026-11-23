import React from 'react';
import PropTypes from 'prop-types';
import LinkButton from '../LinkButton';
import Separator from '../Separator';

const _map = {
  Separator,
  LinkButton
};

const LinkButtonList = ({ className = '', links = [] }) => {
  return (
    <div className={`sq-link-button-list ${className}`}>
      <div className="sq-link-button-list__container">
        {links.map((item) => {
          const MapComp = _map[item.component] || _map.LinkButton;
          return <MapComp {...item} />;
        })}
      </div>
    </div>
  );
};
LinkButtonList.propTypes = {
  className: PropTypes.string
};

export default LinkButtonList;
