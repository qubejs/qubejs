import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'html',
      cmpType: 'RichText',
      label: 'Html',
      editorStyle: 'full',
    },
  ],
}));
