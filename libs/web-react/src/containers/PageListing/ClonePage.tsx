export default ({ formData = {}, ...config }:any = {}) => ({
  pageData: {
    init: {
      formData: {
        to: '/content/',
        name: formData.name || formData.pageData?.title,
        ...formData,
        ...config.init,
      },
    },
    items: [
      {
        component: 'Form',
        name: 'formData',
        fields: [
          {
            cmpType: 'Input',
            name: 'name',
            label: 'Name',
          },
          {
            cmpType: 'DataField',
            name: 'path',
            label: 'Clone From',
          },
          {
            cmpType: 'Input',
            name: 'to',
            label: 'Target path',
            validators: [
              {
                type: 'required',
                defaultValue: '/content/',
                ...config.targetPath?.required,
              },
              {
                type: 'path',
              },
              {
                type: 'startsWith',
                startsWith: '/content/',
                ...config.targetPath?.starts,
              },
            ],
          },
        ],
      },
      {
        component: 'Button',
        actionType: 'submit-event',
        buttonText: 'Clone',
        params: {
          '...': '.formData',
          name: '.formData.name',
          from: '.formData.path',
          to: '.formData.to',
          type: '.formData.type',
        },
      },
    ],
  },
});
