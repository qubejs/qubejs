import React, { useEffect, useRef } from 'react';
import HtmlParser from 'html-react-parser';
import PropTypes from 'prop-types';

const HTML = ({ className = '', value = '', html = '', onAction }) => {
  const container = useRef();
  const handleClick = (e) => {
    let targetToCheck = e.target;
    while (targetToCheck.getAttribute('data-html-root') !== 'root' && targetToCheck && !targetToCheck.getAttribute('href')) {
      targetToCheck = targetToCheck.parentElement;
    }
    if (targetToCheck && (targetToCheck.getAttribute('data-action-type') || targetToCheck.getAttribute('href')?.indexOf('download-doc') > -1)) {
      e.stopPropagation();
      e.preventDefault();
      let actionType = targetToCheck.getAttribute('data-action-type');
      if (targetToCheck.getAttribute('href')?.indexOf('download-doc') > -1) {
        actionType = 'download-doc';
      }
      let params = {};
      for (var i = 0; i < targetToCheck.attributes.length; i++) {
        params[targetToCheck.attributes[i].name] = targetToCheck.attributes[i].value;
      }
      onAction && onAction({}, { actionType, ...params });
    }
  };
  useEffect(() => {
    container.current.addEventListener('click', handleClick, false);
  }, []);
  return (
    <div className={`sq-html ${className}`} data-html-root="root">
      <div className="sq-html__container" ref={container}>
        <div className="sq-html__html">{HtmlParser(html || value)}</div>
      </div>
    </div>
  );
};

HTML.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
};

export default HTML;
