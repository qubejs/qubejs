import React from 'react';
import Loading from '../Loading';
const BasicRTE = React.lazy(() => import('./BasicRTE'));

const RTE = (props) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <BasicRTE {...props} />
    </React.Suspense>
  );
};
export default RTE;
