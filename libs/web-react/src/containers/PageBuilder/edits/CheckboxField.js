import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';
export default withEditTabs({
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'className',
      cmpType: 'Input',
      label: 'className',
    },
    {
      name: 'label',
      cmpType: 'Input',
      label: 'Label',
    },
    {
      name: 'text',
      cmpType: 'Input',
      label: 'Text',
    },
    {
      name: 'selectedValue',
      cmpType: 'Input',
      label: 'selectedValue',
    },
    {
      name: 'defaultValue',
      cmpType: 'Input',
      label: 'defaultValue',
    },
  ],
});
