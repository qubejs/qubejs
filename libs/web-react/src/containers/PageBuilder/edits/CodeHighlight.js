import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';
export default withEditTabs({
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'code',
      cmpType: 'Textarea',
      label: 'code',
      minRows: 15
    },
    {
      name: 'language',
      cmpType: 'Input',
      label: 'language',
    },
  ],
});
