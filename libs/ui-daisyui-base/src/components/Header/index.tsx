import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'html-react-parser';
import { utils, cordova } from '@qubejs/web-react';

const { object } = utils;
const { resolveImageUrl } = cordova;

const Header = ({ eyebrow, header, headerTag = 'h1', bodyTag = 'div', subHeader, className = '', imageUrl, userData }:any) => {
  const HTag = headerTag;
  const BTag = bodyTag;
  return (
    <div className={`sq-header ${className}`}>
      {eyebrow && <div className={`sq-header__eyebrow`}>{ReactHtmlParser(object.processMessage(eyebrow, userData))}</div>}
      {header && <HTag className={`sq-header__header`}>{ReactHtmlParser(object.processMessage(header, userData))}</HTag>}
      {subHeader && <BTag className={`sq-header__sub-header`}>{ReactHtmlParser(object.processMessage(subHeader, userData))}</BTag>}
      {imageUrl && <img className="sq-header__image" src={resolveImageUrl(object.processMessage(imageUrl, userData))} />}
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string,
  header: PropTypes.string,
  headerTag: PropTypes.string,
  bodyTag: PropTypes.string,
  userData: PropTypes.object,
  subHeader: PropTypes.string
};

export default Header;
