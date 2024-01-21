import React from 'react';
import ListIcon from '@mui/icons-material/SelectAll';
const Icon = React.lazy(() => import('./Icon'));

const IconComp = (props) => {
  return (
    <React.Suspense fallback={<ListIcon />}>
      <Icon {...props} />
    </React.Suspense>
  );
};
export default IconComp;
