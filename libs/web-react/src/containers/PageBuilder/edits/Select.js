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
      name: 'inputVariant',
      cmpType: 'Radio',
      label: 'Input Variant',
      options: GLOBAL_OPTIONS.inputVariant.toArray(),
    },
    {
      name: 'options',
      cmpType: 'FormList',
      label: 'Options',
      formClassName: 'sq-form--2-cols',
      fields: [
        {
          cmpType: 'Input',
          label: 'Value',
          name: 'value',
        },
        {
          cmpType: 'Input',
          label: 'Text',
          name: 'text',
        },
      ],
    },
  ],
});
