import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { storage } from '../../../utils';

const FullBgTemplate = ({ header = '', body = '', links = [], imageUrl = '' }) => {
  const { LinkButton } = storage.components.get();
  return <div className='sq-callto-action__container' style={{ background: `url(${imageUrl})`, backgroundSize: 'cover' }}>

    <div className="sq-callto-action__content">
      <h2 className="sq-callto-action__header">{header}</h2>
      <p className="sq-callto-action__info">
        {body}
      </p>
      <div className="sq-callto-action__actions">
        {links.map((link, index) => {
          return <LinkButton key={index} {...link} buttonText={link.text}> </LinkButton>;
        })}
      </div>
    </div>
  </div>;
};
FullBgTemplate.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
  imageUrl: PropTypes.string,
  links: PropTypes.array
};

export default FullBgTemplate;