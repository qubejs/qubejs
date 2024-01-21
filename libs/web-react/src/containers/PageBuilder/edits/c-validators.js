import { getValidators } from '../../../utils/validator';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import { GLOBAL_OPTIONS } from '../../../globals';
const allowedValidators = ['required', 'equals', 'email', 'or', 'phone', 'internationalphone', 'fieldName', 'path', 'requiredArray', 'exists', 'notExists', 'digits', 'strongPassword', 'length', 'compareField', 'number', 'emailphone', 'emailinternationalphone', 'date', 'password', 'postalCN', 'regex'];

const validatorExport = (inner) => ({
  name: 'validators',
  cmpType: 'FormList',
  label: 'Validators',
  formClassName: 'sq-form--2-cols',
  fields: [
    {
      cmpType: 'Select',
      label: 'Type',
      name: 'type',
      options: () =>
        sortBy(
          filter(Object.keys(getValidators()), (item) => allowedValidators.indexOf(item) > -1).map((item) => ({
            text: item,
            value: item,
          })),
          'text'
        ),
    },
    {
      ...(!inner ? validatorExport(true) : {}),
      name: 'validations',
      match: {
        type: {
          validators: [
            {
              type: 'equals',
              matchValue: 'or',
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'Match Value',
      name: 'matchValue',
      match: {
        type: {
          validators: [
            {
              type: 'equals',
              matchValue: 'equals',
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'Default Value',
      name: 'defaultValue',
      match: {
        type: {
          validators: [
            {
              type: 'equals',
              matchValue: 'required',
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'fieldName',
      name: 'fieldName',
      match: {
        type: {
          validators: [
            {
              type: 'oneOf',
              options: ['equals', 'compareField'],
            },
          ],
        },
      },
    },
    {
      cmpType: 'Radio',
      display: 'Inline',
      label: 'subType',
      name: 'subType',
      options: GLOBAL_OPTIONS.compareOperators.toArray(),
      match: {
        type: {
          validators: [
            {
              type: 'oneOf',
              options: ['equals'],
            },
          ],
        },
      },
    },
    {
      cmpType: 'Radio',
      display: 'Inline',
      label: 'compare',
      name: 'compare',
      options: GLOBAL_OPTIONS.compareOperators.toArray(),
      match: {
        type: {
          validators: [
            {
              type: 'oneOf',
              options: ['compareField'],
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'exact',
      name: 'exact',
      match: {
        type: {
          validators: [
            {
              type: 'equals',
              matchValue: 'length',
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'min',
      name: 'min',
      match: {
        type: {
          validators: [
            {
              type: 'oneOf',
              options: ['date', 'length'],
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'max',
      name: 'max',
      match: {
        type: {
          validators: [
            {
              type: 'oneOf',
              options: ['date', 'length'],
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'digits',
      name: 'digits',
      match: {
        type: {
          validators: [
            {
              type: 'equals',
              matchValue: 'digits',
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'regex',
      name: 'regex',
      match: {
        type: {
          validators: [
            {
              type: 'equals',
              matchValue: 'regex',
            },
          ],
        },
      },
    },
    {
      cmpType: 'Input',
      label: 'Error Message',
      name: 'message',
    },
    {
      cmpType: 'Input',
      label: 'Error Key',
      name: 'key',
    },
  ],
});
export default validatorExport;
