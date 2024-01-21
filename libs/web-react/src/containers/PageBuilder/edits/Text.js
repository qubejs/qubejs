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
      name: 'text',
      cmpType: 'Input',
      label: 'text',
    },
    {
      name: 'tag',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.htmlTags.toArray(),
      label: 'Tag',
    },
    {
      name: 'parentTag',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.htmlTags.toArray(),
      label: 'Wrapper Tag',
    },
  ],
});
