import React from 'react';
import Loading from '../Loading';
const HTML = React.lazy(() => import('./HTML'));

const HTMLComp = (props) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <HTML {...props} />
    </React.Suspense>
  );
};
export default HTMLComp;
