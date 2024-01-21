import React from 'react';
import Loading from '../Loading';
const DateSelector = React.lazy(() => import('./DateSelector'));

const DTEComponent = (props) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <DateSelector {...props} />
    </React.Suspense>
  );
};
export default DTEComponent;
