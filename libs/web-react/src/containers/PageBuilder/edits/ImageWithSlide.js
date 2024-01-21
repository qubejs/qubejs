import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, iconList }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'image',
      cmpType: 'FormObject',
      label: 'image',
    },
    {
      name: 'align',
      cmpType: 'Autocomplete',
      label: 'align',
      options: GLOBAL_OPTIONS.imageAlign.toArray(),
    },
    {
      name: 'classes',
      cmpType: 'FormObject',
      label: 'classes',
    },
    {
      name: 'eyebrow',
      cmpType: 'Input',
      label: 'eyebrow',
    },
    {
      name: 'header',
      cmpType: 'Input',
      label: 'header',
    },
    {
      name: 'headerTag',
      cmpType: 'Autocomplete',
      label: 'headerTag',
      options: GLOBAL_OPTIONS.headerTags.toArray(),
    },
    {
      name: 'bgColor',
      cmpType: 'ColorPicker',
      label: 'bgColor',
    },
  ],
}));
