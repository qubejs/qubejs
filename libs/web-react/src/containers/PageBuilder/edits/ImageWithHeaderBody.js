import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, iconList }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'styleName',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.imageWithHeaderBody.toArray(),

      label: 'styleName',
    },
    {
      name: 'imageUrl',
      cmpType: 'Input',
      label: 'imageUrl',
    },
    {
      name: 'header',
      cmpType: 'Input',
      label: 'header',
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
