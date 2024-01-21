import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons, iconColorTypes, colorTypes }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'icon',
      cmpType: 'Autocomplete',
      label: 'icon',
      options: getIcons,
    },
    {
      name: 'eyebrow',
      label: 'eyebrow',
    },
    
    {
      name: 'template',
      cmpType: 'Autocomplete',
      label: 'template',
      options: GLOBAL_OPTIONS.pricingTemplates.toArray(),
    },
    {
      name: 'header',
      label: 'header',
    },
    {
      name: 'subHeader',
      label: 'subHeader',
    },
    {
      name: 'features',
      label: 'feature',
      cmpType: 'FormObject',
    },
    {
      name: 'items',
      label: 'items',
      cmpType: 'FormList',
      fields: [
        {
          name: 'header',
          label: 'header',
        },
        {
          name: 'price',
          label: 'price',
        },
        {
          name: 'color',
          cmpType: 'Autocomplete',
          label: 'color',
          options: colorTypes,
        },
        {
          cmpType: 'Autocomplete',
          name: 'icon',
          label: 'icon',
          options: getIcons,
        },
        {
          label: 'features',
          name: 'features',
          cmpType: 'FormObject',
        },
        {
          label: 'actions',
          name: 'actions',
          cmpType: 'FormObject',
        },
      ],
    },
  ],
}));
