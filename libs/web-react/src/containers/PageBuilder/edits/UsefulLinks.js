import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons, iconColorTypes }) => ({
  classNames: [
    { text: 're-useful-links--gray-background', value: 're-useful-links--gray-background' },
    {
      text: 're-useful-links--cols-only',
      value: 're-useful-links--cols-only',
    },
  ],

  pageData: {
    items: [],
  },
  general: [
    { name: 'header', label: 'Header' },
    {
      name: 'links',
      cmpType: 'FormList',
      label: 'Links',
      fields: [
        {
          name: 'text',
          label: 'Text',
        },
        {
          name: 'iconName',
          cmpType: 'Autocomplete',
          options: getIcons,
          label: 'iconName',
        },
        {
          name: 'iconColor',
          cmpType: 'Autocomplete',
          options: iconColorTypes,
          label: 'iconColor',
        },
        {
          name: 'to',
          label: 'Url',
        },
      ],
    },
  ],
}));
