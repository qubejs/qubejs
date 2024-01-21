import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons, iconColorTypes }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'style',
      cmpType: 'Input',
      label: 'style',
    },
    {
      name: 'template',
      cmpType: 'Autocomplete',
      label: 'template',
      options: GLOBAL_OPTIONS.featureContentTemplates.toArray(),
    },
    {
      name: 'classes',
      cmpType: 'FormObject',
      label: 'classes',
    },
    {
      name: 'items',
      cmpType: 'FormList',
      label: 'items',
      formClassName: 'sq-form--2-cols',
      fields: [
        {
          cmpType: 'Autocomplete',
          label: 'Icon',
          options: getIcons,
          name: 'iconName',
        },
        {
          cmpType: 'Autocomplete',
          label: 'Icon color',
          options: iconColorTypes,
          name: 'iconColor',
        },
        {
          cmpType: 'Input',
          label: 'Icon size',
          name: 'iconSize',
        },
        {
          cmpType: 'Input',
          label: 'header',
          name: 'header',
        },
        {
          cmpType: 'Input',
          label: 'subHeader',
          name: 'subHeader',
        },
      ],
    },
  ],
}));
