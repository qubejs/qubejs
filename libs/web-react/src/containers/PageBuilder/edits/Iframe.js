import { withEditTabsConfig } from './Common';

export default withEditTabsConfig(({ defaultParams }) => ({
  enableValidations: false,
  pageData: {
    items: [],
  },
  general: [
    {
      name: 'url',
      cmpType: 'Input',
      label: 'Url',
    },
    {
      name: 'iframeParams',
      cmpType: 'FormObject',
      label: 'iframeParams',
    },
  ],
}));
