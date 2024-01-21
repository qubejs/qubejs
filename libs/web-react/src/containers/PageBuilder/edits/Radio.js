import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';
export default withEditTabs({
  pageData: {
    items: [
     
    ],
  },
  general: [
    {
      name: 'label',
      cmpType: 'Input',
      label: 'Label',
    },
    {
      name: 'className',
      cmpType: 'Input',
      label: 'className',
    },
    {
      name: 'display',
      cmpType: 'Radio',
      options: GLOBAL_OPTIONS.radioDisplay.toArray(),
    },
    {
      name: 'options',
      cmpType: 'FormList',
      label: 'Options',
      formClassName: 'sq-form--2-cols',
      fields: [
        {
          cmpType: 'Input',
          label: 'Key',
          name: 'value',
        },
        {
          cmpType: 'Input',
          label: 'Value',
          name: 'text',
        },
      ],
    },
  ],
});
