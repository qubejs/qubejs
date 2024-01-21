import React from 'react';
import PropTypes from 'prop-types';

import './_iframe.scss';

function IframeCmp({ className = '', url, iframeParams = {} }:any) {
  return (
    <iframe className={`sq-iframe ${className}`} src={url} {...iframeParams}></iframe>
  );
}

IframeCmp.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
};

export default IframeCmp;
