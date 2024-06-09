export default {
  pageConfig: {
    pageData: {
      title: 'Signup',
      className: 'body-container-small',
      // containerTemplate: 'Authentication',
      contentBodyClass: null,
      reset: {
        type: 'keys',
        keys: ['register', 'register_errors'],
      },
      hook: {
        load: [
          {
            url: '/api/v1/countries',
            dataKey: 'api_country',
            method: 'post',
          },
        ],
      },
      merge: {
        lastErrorMessage: '.lastError.message',
      },
      items: [
        {
          component: 'Header',
          header: 'Signup',
          className: 'mt-wide',
        },
        {
          component: 'Form',
          name: 'register',
          fields: [
            {
              cmpType: 'Link',
              buttonText: 'Have login?',
              to: 'login',
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
              name: 'fullName',
              label: 'Full Name',
              validators: [
                {
                  type: 'required',
                },
              ],
            },
            {
              cmpType: 'Input',
              name: 'email',
              label: 'Email',
              validators: [
                {
                  type: 'required',
                },
                {
                  type: 'email',
                },
              ],
            },
            {
              cmpType: 'Input',
              name: 'phone',
              label: 'Phone number',
              mask: {
                type: 'phone',
              },
              validators: [
                {
                  type: 'required',
                },
                {
                  type: 'phone',
                },
              ],
            },
            {
              cmpType: 'SelectPopup',
              name: 'countryCode',
              label: 'Country',
              inject: {
                options: 'api_country.countries',
              },
              textField: 'name',
              actionLabel: 'Choose Country',
              valueField: 'isoCode',
              validators: [
                {
                  type: 'required',
                },
              ],
            },
            {
              cmpType: 'Input',
              name: 'password',
              label: 'Password',
              type: 'password',
              impactOn: ['confirmPassword'],
              validators: [
                {
                  type: 'required',
                },
                {
                  type: 'strongPassword',
                },
              ],
            },
            {
              cmpType: 'Input',
              name: 'confirmPassword',
              label: 'Confirm Password',
              type: 'password',
              validators: [
                {
                  type: 'required',
                },
                {
                  type: 'compareField',
                  fieldName: 'password',
                  message: 'Both passwords should match',
                },
              ],
            },
          ],
          actions: [
            {
              buttonText: 'Signup',
              size: 'large',
              actionClassName: 'block',
              className: 'sq-button--block',
              actionType: 'submit',
              postHook: 'auth.register',
              params: {
                fullName: '.register.fullName',
                email: '.register.email',
                countryCode: '.register.countryCode',
                password: '.register.password',
                phone: '.register.phone',
              },
            },
          ],
        },
      ],
    },
  },
};
