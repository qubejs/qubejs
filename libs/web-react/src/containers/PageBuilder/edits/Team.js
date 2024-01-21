import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams, iconList }) => ({
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
      name: 'header',
      cmpType: 'Input',
      label: 'header',
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
          cmpType: 'Input',
          label: 'Picture',
          name: 'profilePic',
        },
        {
          cmpType: 'Input',
          label: 'header',
          name: 'header',
        },
        {
          cmpType: 'Input',
          label: 'designation',
          name: 'designation',
        },
        {
          cmpType: 'Input',
          label: 'subHeader',
          name: 'subHeader',
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
