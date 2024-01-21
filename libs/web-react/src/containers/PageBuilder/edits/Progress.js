import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';
export default withEditTabs({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'type',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.progressTypes.toArray(),
      label: 'type',
    },
    {
      name: 'style',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.progressStyles.toArray(),
      label: 'style',
    },
    {
      name: 'color',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.colorTypes.toArray(),
      label: 'color',
    },
    {
      name: 'overlay',
      cmpType: 'Switch',
      label: 'overlay',
    },
    {
      name: 'overlayStyle',
      cmpType: 'Input',
      label: 'overlayStyle',
    },
  ],
});
