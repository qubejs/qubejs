import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { storage } from '../../../utils';

const DefaultTemmplate = ({ header = '', body = '', links = [], imageUrl = '' }) => {
  const { LinkButton } = storage.components.get();
  return (
    <>
      <div className="sq-callto-action__left">
        <div className="sq-callto-action__image">
          <img src={imageUrl} alt="alt" />
        </div>
      </div>
      <div className="sq-callto-action__right">
        <h2 className="sq-callto-action__header">{header}</h2>
        <p className="sq-callto-action__info">{body}</p>
        <div className="sq-callto-action__actions">
          {links.map((link, index) => {
            return <LinkButton key={index} {...link} buttonText={link.text}></LinkButton>;
          })}
        </div>
      </div>
    </>
  );
};
DefaultTemmplate.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
  imageUrl: PropTypes.string,
  links: PropTypes.array
};

export default DefaultTemmplate;
