import PropTypes from 'prop-types';
import Icon from '../Icon';
import { utils } from '@qubejs/web-react';
import './_useful-links.scss';
const redirect = utils.redirect;

const UsefullLinks = ({ className = '', header, links, target = '_blank' }:any) => {

  const handleClick = (prj) => {
    prj.to && redirect.redirectTo(prj.to, {}, { target });
  };

  return (
    <div className={`sq-useful-links ${className}`}>
      {header && <h1 className="sq-useful-links__header mb-xtrawide">{header}</h1>}
      <div className="sq-useful-links__links container-fluid container-max">
        {links?.map((link, idx) => {
          return (
            <a href={link.url} className="sq-useful-links__link" key={idx} onClick={() => handleClick(link)}>
              {link.iconName && <Icon className="sq-useful-links__icon" name={link.iconName} variant={`${link.iconColor || 'primary'}`} />}
              <div className="sq-useful-links__link-text">{link.text}</div>
              <Icon className="sq-useful-links__icon" name="arrow-right" variant="primary" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

UsefullLinks.propTypes = {
  className: PropTypes.string,
  target: PropTypes.string,
  header: PropTypes.string,
  links: PropTypes.array,
};

export default UsefullLinks;
