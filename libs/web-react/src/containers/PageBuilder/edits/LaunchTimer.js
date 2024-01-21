import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';
export default withEditTabs({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'value',
      cmpType: 'DateSelector',
      instanceType: 'DateTimePicker',
      inputFormat: 'MM/dd/yyyy HH:mm',
      mask: '__/__/____ __:__',
      label: 'value',
    },
  ],
});
