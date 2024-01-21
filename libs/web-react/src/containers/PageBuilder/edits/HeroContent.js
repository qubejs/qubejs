import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, getIcons }) => ({
  classNames: GLOBAL_OPTIONS.heroStyles.toArray(),
  enableValidations: false,
  pageData: {
    items: [
      
    ],
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
      name: 'templateClassName',
      cmpType: 'Input',
      label: 'templateClassName',
    },
    {
      name: 'imageUrl',
      cmpType: 'Input',
      label: 'imageUrl',
    },
    {
      name: 'background',
      cmpType: 'Input',
      label: 'background',
    },
    {
      name: 'template',
      cmpType: 'Autocomplete',
      label: 'template',
      options: GLOBAL_OPTIONS.heroTemplates.toArray(),
    },
    {
      name: 'subHeader',
      cmpType: 'RichText',
      label: 'Sub Header',
      editorStyle: 'full',
    },
    {
      name: 'links',
      cmpType: 'FormList',
      label: 'Links',
      formClassName: 'sq-form--2-cols',
      fields: [
        {
          cmpType: 'Input',
          label: 'Button Text',
          name: 'buttonText',
        },
        {
          cmpType: 'Autocomplete',
          label: 'Icon Name',
          name: 'iconName',
          options: getIcons,
        },
        {
          cmpType: 'Autocomplete',
          label: 'Type',
          name: 'type',
          options: GLOBAL_OPTIONS.linkTypes.toArray(),
        },
        {
          cmpType: 'Autocomplete',
          label: 'variant',
          name: 'variant',
          options: GLOBAL_OPTIONS.variants.toArray(),
        },
        {
          cmpType: 'Autocomplete',
          label: 'size',
          name: 'size',
          options: GLOBAL_OPTIONS.buttonSize.toArray(),
        },
        {
          cmpType: 'Input',
          label: 'Icon Direction',
          name: 'iconDirection',
        },
        {
          cmpType: 'Input',
          label: 'To Path',
          name: 'to',
        },
      ],
    },
  ],
}));
