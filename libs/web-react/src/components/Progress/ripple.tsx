import React from 'react';

const Ripple = () => {
  return <div className="tp-progress__spinner">
    <div className="lds-ripple"><div></div><div></div></div>
  </div>;
};

Ripple.propTypes = {
};

export default Ripple;