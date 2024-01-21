import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, iconList }) => ({
  classNames : GLOBAL_OPTIONS.imageBlockWithTextCss.toArray(),
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'styleName',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.imageBlockWithTextStyles.toArray(),

      label: 'styleName',
    },
    {
      name: 'header',
      cmpType: 'Input',
      label: 'header',
    },
    {
      name: 'imageUrl',
      cmpType: 'Input',
      label: 'imageUrl',
    },
    {
      name: 'subHeader',
      cmpType: 'RichText',
      label: 'subHeader',
    },
    {
      cmpType: 'FormObject',
      label: 'links',
      name: 'links',
    },
  ],
}));
