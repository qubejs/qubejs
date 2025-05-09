import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons, iconSize, iconColorTypes }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'itemClassName',
      cmpType: 'Input',
      label: 'itemClassName',
    },
    {
      name: 'template',
      cmpType: 'Autocomplete',
      label: 'template',
      options: GLOBAL_OPTIONS.featureContentTemplates.toArray(),
    },
    {
      name: 'items',
      cmpType: 'FormList',
      label: 'items',
      formClassName: 'sq-form--2-cols',
      fields: [
        {
          cmpType: 'IconSelector',
          label: 'Icon',
          options: getIcons,
          name: 'icon',
        },
        {
          cmpType: 'Autocomplete',
          label: 'Icon color',
          options: iconColorTypes,
          name: 'iconColor',
        },
        {
          cmpType: 'Autocomplete',
          label: 'Icon size',
          options: iconSize,
          name: 'iconSize',
        },
        {
          cmpType: 'Input',
          label: 'title',
          name: 'title',
        },
        {
          cmpType: 'Input',
          label: 'imageUrl',
          name: 'imageUrl',
        },
        {
          cmpType: 'Input',
          label: 'description',
          name: 'description',
        },
        {
          cmpType: 'FormObject',
          label: 'links',
          name: 'links',
        },
      ],
    },
  ],
}));
