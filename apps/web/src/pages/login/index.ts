export default {
  pageConfig: {
    pageData: {
      title: 'Login',
      // containerTemplate: 'Authentication',
      className: 'body-container-small',
      reset: {
        type: 'keys',
        keys: ['login', 'login_errors'],
      },
      merge: {
        lastErrorMessage: '.lastError.message',
      },
      items: [
        {
          component: 'Header',
          header: 'Login',
          className: 'mt-wide',
        },
        {
          component: 'Form',
          name: 'login',
          fields: [
            {
              cmpType: 'Link',
              buttonText: "Don't have login?",
              to: 'register',
            },
            {
              cmpType: 'Alert',
              inject: {
                message: 'lastErrorMessage',
              },
              type: 'error',
              match: {
                lastErrorMessage: {
                  validators: [
                    {
                      type: 'exists',
                    },
                  ],
                },
              },
            },
            {
              cmpType: 'Input',
              name: 'emailphone',
              label: 'Email/Phone',
              validators: [
                {
                  type: 'required',
                },
                {
                  type: 'emailphone',
                },
              ],
            },
            {
              cmpType: 'Input',
              name: 'password',
              type: 'password',
              label: 'Password',
              validators: [
                {
                  type: 'required',
                },
              ],
            },
          ],
          actions: [
            {
              buttonText: 'Login',
              size: 'large',
              actionClassName: 'block',
              className: 'sq-button--block',
              actionType: 'submit-form',
              postHook: 'auth.authenticate',
              params: {
                '...login': '.login',
              },
            },
          ],
        },
      ],
    },
  },
};
