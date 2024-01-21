import { GLOBAL_OPTIONS } from '../../../globals';
import { withEditTabs } from './Common';

export default withEditTabs({
  enableValidations: false,
  enableActions: true,
  classNames: GLOBAL_OPTIONS.formStyles.toArray(),
  saveParams: {},
  pageData: {
    merge: {
      liveFields: '.fieldsMeta.liveFields',
      formFields: '.fieldsMeta.formFields',
    },

    items: [],
  },
  general: [
    {
      name: 'buttonText',
      cmpType: 'Input',
      label: 'buttonText',
    },
    {
      name: 'size',
      cmpType: 'Select',
      label: 'size',
      options: GLOBAL_OPTIONS.buttonSize.toArray(),
    },
    {
      name: 'actionType',
      cmpType: 'Select',
      label: 'Action Type',
      options: GLOBAL_OPTIONS.actionTypes.toArray(),
    },
    {
      name: 'url',
      cmpType: 'Input',
      label: 'url',
    },
    {
      name: 'to',
      cmpType: 'Input',
      label: 'to',
    },
    {
      name: 'method',
      cmpType: 'Radio',
      display: 'Inline',
      options: GLOBAL_OPTIONS.methodTypes.toArray(),
      label: 'method',
    },
    {
      name: 'variant',
      cmpType: 'Autocomplete',
      options: GLOBAL_OPTIONS.variants.toArray(),
      label: 'variant',
    },
    {
      name: 'advanced',
      cmpType: 'Switch',
      label: 'Advanced params',
    },
    {
      name: 'params',
      cmpType: 'FormObject',
      output: 'object',
      label: 'params',
      match: {
        fieldsMeta: {
          validators: [
            {
              type: 'or',
              validations: [
                {
                  type: 'notExists',
                },
                {
                  type: 'equals',
                  fieldName: 'advanced',
                  matchValue: true,
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'params',
      cmpType: 'FormObject',
      output: 'object',
      label: 'params',
      fields: [
        {
          cmpType: 'Autocomplete',
          name: 'key',
          label: 'Field Name',
          inject: {
            options: 'fieldsMeta.formFields',
          },
          textField: 'name',
          valueField: 'code',
          match: {
            formFields: {
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
          name: 'key',
          label: 'Field Name',
          match: {
            formFields: {
              validators: [
                {
                  type: 'notExists',
                },
              ],
            },
          },
        },
        {
          label: 'Value Field',
          cmpType: 'Input',
          name: 'value',
          match: {
            liveFields: {
              validators: [
                {
                  type: 'notExists',
                },
              ],
            },
          },
        },
        {
          label: 'Value Field',
          cmpType: 'Autocomplete',
          inject: {
            options: 'fieldsMeta.liveFields',
          },
          name: 'value',
          match: {
            liveFields: {
              validators: [
                {
                  type: 'exists',
                },
              ],
            },
          },
        },
      ],
      match: {
        fieldsMeta: {
          validators: [
            {
              type: 'exists',
            },
          ],
        },
        advanced: {
          validators: [
            {
              type: 'notExists',
            },
          ],
        },
      },
    },
    {
      name: 'postHook',
      cmpType: 'Input',
      label: 'postHook',
    },
    {
      name: 'validateGroup',
      cmpType: 'Input',
      label: 'validateGroup',
    },
    {
      name: 'defaultResponse',
      cmpType: 'Form',
      fields: [
        {
          cmpType: 'FormObject',
          name: 'success',
          label: 'success',
        },
        {
          cmpType: 'FormObject',
          nameL: 'success',
          label: 'error',
        },
      ],
    },
    {
      name: 'successAfterScript',
      cmpType: 'Textarea',
      label: 'successAfterScript',
    },
    {
      name: 'errorAfterScript',
      cmpType: 'Textarea',
      label: 'errorAfterScript',
    },
  ],
});
