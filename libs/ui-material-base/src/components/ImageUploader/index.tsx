import React from 'react';
import Loading from '../Loading';
const ImageUploader = React.lazy(() => import('./ImageUploader'));

const ImageUploaderComponent = (props) => {
  return (
    <React.Suspense fallback={<Loading />}>
      <ImageUploader {...props} />
    </React.Suspense>
  );
};
export default ImageUploaderComponent;
