import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';
export default withEditTabs({
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'message',
      cmpType: 'Input',
      label: 'Message',
    },
    {
      name: 'header',
      cmpType: 'Input',
      label: 'Header',
    },
    {
      name: 'type',
      cmpType: 'Autocomplete',
      label: 'Type',
      options: GLOBAL_OPTIONS.alerTypes.toArray(),
    },
    {
      name: 'variant',
      cmpType: 'Autocomplete',
      label: 'Variant',
      options: GLOBAL_OPTIONS.inputVariant.toArray(),
    },
    {
      name: 'color',
      cmpType: 'Autocomplete',
      label: 'Color',
      options: GLOBAL_OPTIONS.alerTypes.toArray(),
    },
  ],
});
