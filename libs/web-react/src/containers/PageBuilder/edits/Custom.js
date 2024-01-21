// import { GLOBAL_OPTIONS } from '../../../globals';
// import { withEditTabs } from './Common';
export default {
  pageData: {
    init: {},
    items: [
      {
        component: 'FormObject',
        name: 'main',
      },
      {
        component: 'Button',
        actionType: 'submit-event',
        buttonText: 'Save',
        size: 'medium',
        params: {
          '...main': '.main',
        },
      },
    ],
  },
};
