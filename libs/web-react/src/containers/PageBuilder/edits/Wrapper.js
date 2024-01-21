import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams = {} }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'bodyClassName',
      cmpType: 'Input',
      label: 'bodyClassName',
    },
    {
      name: 'bodyContainerClassName',
      cmpType: 'Input',
      label: 'bodyContainerClassName',
    },
  ],
}));
