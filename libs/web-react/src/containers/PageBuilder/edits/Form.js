import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';

export default withEditTabs({
  enableValidations: false,
  pageData: {
    items: [
      
    ],
  },
  general: [
    {
      name: 'group',
      label: 'Validation Group',
    },
    {
      name: 'forceValidate',
      label: 'forceValidate',
      cmpType: 'CheckboxField',
      selectedValue: true,
      defaultValue: false,
    },
  ],
});
