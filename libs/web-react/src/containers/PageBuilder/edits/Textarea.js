import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';

export default withEditTabs({
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'label',
      cmpType: 'Input',
      label: 'Label',
    },

    {
      name: 'minRows',
      cmpType: 'Input',
      label: 'minRows',
    },

    {
      name: 'maxRows',
      cmpType: 'Input',
      label: 'maxRows',
    },
  ],
});
