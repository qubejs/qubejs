import React from 'react';
import Loading from '../Loading';
const FileUploader = React.lazy(() => import('./FileUploader'));

const DTEComponent = (props: any) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <FileUploader {...props} />
    </React.Suspense>
  );
};
export default DTEComponent;
