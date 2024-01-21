import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams }) => ({
  enableValidations: false,
  classNames: GLOBAL_OPTIONS.headerStyles.toArray(),
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'header',
      cmpType: 'Input',
      label: 'Header',
    },
    {
      name: 'headerTag',
      cmpType: 'Select',
      label: 'Header Tag',
      options: GLOBAL_OPTIONS.headerTags.toArray(),
    },
    {
      name: 'subHeader',
      cmpType: 'RichText',
      label: 'Sub Header',
      editorStyle: 'full',
    },
  ],
}));
