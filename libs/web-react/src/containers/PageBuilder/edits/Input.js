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
      name: 'helperText',
      cmpType: 'Input',
      label: 'helperText',
    },
    {
      name: 'variant',
      cmpType: 'Radio',
      label: 'variant',
      options: GLOBAL_OPTIONS.inputVariant.toArray(),
    },
    {
      name: 'type',
      cmpType: 'CheckboxField',
      text: 'Password',
      selectedValue: 'password',
    },
    {
      name: 'mask',
      cmpType: 'Form',
      fields: [
        {
          cmpType: 'Autocomplete',
          name: 'type',
          label: 'Mask Type',
          options: GLOBAL_OPTIONS.maskTypes.toArray(),
        },
      ],
    },
  ],
});
