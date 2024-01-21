import React from 'react';
import Loading from '../Loading';
const CustomChart = React.lazy(() => import('./Chart'));

const Chart = (props) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <CustomChart {...props} />
    </React.Suspense>
  );
};
export default Chart;
