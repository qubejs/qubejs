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
      name: 'className',
      cmpType: 'Input',
      label: 'className',
    },
    {
      name: 'editorStyle',
      cmpType: 'Autocomplete',
      label: 'editorStyle',
      options: GLOBAL_OPTIONS.editorStyle.toArray(),
    },
  ],
});
