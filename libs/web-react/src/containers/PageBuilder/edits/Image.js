import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams }) => ({
  classNames: GLOBAL_OPTIONS.imageStyles.toArray(),
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'imageUrl',
      cmpType: 'Input',
      label: 'imageUrl',
    },
    {
      name: 'size',
      cmpType: 'Input',
      label: 'size',
    },
    {
      name: 'style',
      cmpType: 'FormObject',
      label: 'style',
    },
  ],
}));
