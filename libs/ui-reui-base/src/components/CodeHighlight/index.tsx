import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';
const { win } = utils;
const CodeHighlight = ({ code, className, language = '' }) => {
  const codeBlock = useRef(null);

  useEffect(() => {
    win.getWindow().hljs && win.getWindow().hljs.highlightBlock(codeBlock.current);
  }, [code]);
  return (
    <div className={`sq-codehighlight ${className}`}>
      <pre className={`${language}`} ref={codeBlock}>
        {code}
      </pre>
    </div>
  );
};

CodeHighlight.propTypes = {
  className: PropTypes.string,
  code: PropTypes.string
};

export default CodeHighlight;
