import { default as DynamicContentImpl, DynamicContent } from './DynamicContent';
import { useParams, useLocation } from 'react-router-dom';
const DynamicContentRoot = (props) => {
  const params = useParams();
  const location = useLocation();
  return <DynamicContentImpl {...props} location={location} params={params} />;
};

export { DynamicContent }
export default DynamicContentRoot;
