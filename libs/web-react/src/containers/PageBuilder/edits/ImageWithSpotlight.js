import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons, colorTypes }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'header',
      cmpType: 'Input',
      label: 'header',
    },
    {
      name: 'bgImageUrl',
      cmpType: 'Input',
      label: 'bgImageUrl',
    },
    {
      name: 'actions',
      cmpType: 'FormList',
      fields: [
        {
          name: 'buttonText',
          label: 'buttonText',
        },
        {
          name: 'iconName',
          cmpType: 'Autocomplete',
          options: getIcons,
          label: 'iconName',
        },
        {
          name: 'actionType',
          label: 'actionType',
        },
        {
          name: 'to',
          label: 'to',
        },
        {
          name: 'color',
          cmpType: 'Autocomplete',
          options: colorTypes,
          label: 'color',
        },
      ],
    },
  ],
}));
