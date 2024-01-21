import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons, iconColorTypes }) => ({
  pageData: {
    items: [],
  },
  general: [
    { name: 'header', label: 'Header' },
    { name: 'bgColor', label: 'Background Color', helperText: 'Use only dark colors' },
    { name: 'footerText', cmpType: 'RichText', label: 'Footer Text' },
    {
      name: 'info',
      cmpType: 'FormList',
      label: 'Info',
      fields: [
        {
          name: 'iconName',
          cmpType: 'Autocomplete',
          options: getIcons,
          label: 'Icon',
        },
        {
          name: 'text',
          cmpType: 'Input',
          label: 'Text',
        },
        {
          name: 'iconColor',
          cmpType: 'Autocomplete',
          options: iconColorTypes,
          label: 'iconColor',
        },
        {
          name: 'href',
          label: 'Href',
        },
        {
          name: 'target',
          cmpType: 'CheckboxField',
          selectedValue: '_blank',
          text: 'Open in new window',
        },
      ],
    },
  ],
}));
