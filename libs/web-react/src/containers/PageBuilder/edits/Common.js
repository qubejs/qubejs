import { GLOBAL_OPTIONS } from '../../../globals';
import { icons } from '../../../utils/storage';
import validators from './c-validators';
const tabs = {
  general: {
    text: 'General',
    value: 'general',
  },
  validations: {
    text: 'Validations',
    value: 'validations',
  },
  actions: {
    text: 'Actions',
    value: 'actions',
  },
  match: {
    text: 'Match',
    value: 'match',
  },
};

const defaultGeneral = ({ classNames = [] } = {}) => [
  {
    name: 'name',
    cmpType: 'Input',
    label: 'Field Name',
    validators: [
      {
        type: 'fieldName',
      },
    ],
  },
  {
    name: 'inject',
    cmpType: 'FormObject',
    label: 'Inject',
  },
  {
    name: 'className',
    cmpType: 'InputWithOptions',
    optionsLabel: 'Pre-defined Classes',
    optionCmpType: 'Autocomplete',
    label: 'className',
    options: [...GLOBAL_OPTIONS.genericStyles.toArray(), ...classNames],
  },
];

const defaultValidations = [validators()];

const defaultParams = {
  '...main': '.main',
};

const defaultMatch = [
  {
    name: 'match',
    cmpType: 'FormObject',
    label: 'match',
    formClassName: 'mb-wide',
    fields: [
      {
        cmpType: 'Input',
        label: 'Field Name',
        name: 'key',
      },
      {
        cmpType: 'Form',
        name: 'value',
        fields: [validators()],
      },
    ],
  },
];

const getIconListMap = () => {
  return Object.keys(icons.getAll()).map((name) => ({
    text: name,
    value: name,
  }));
};

export const withEditTabsConfig = (cb) => {
  return withEditTabs(cb({ defaultParams, iconList: getIconListMap(), getIcons: getIconListMap, colorTypes: GLOBAL_OPTIONS.colorTypes.toArray(), iconSize: GLOBAL_OPTIONS.iconSize.toArray(), iconColorTypes: GLOBAL_OPTIONS.iconColorTypes.toArray() }));
};

export const withEditTabs = ({ classNames = [], pageData = {}, general = [], validations = [], saveParams = {}, enableValidations = true, actions = [] }) => {
  const finalGeneral = [...defaultGeneral({ classNames }), ...general];
  const finalValidations = enableValidations ? [...defaultValidations, ...validations] : validations;
  const isGeneralTab = finalGeneral && finalGeneral.length !== 0;
  const isValidationsTab = finalValidations && finalValidations.length !== 0;
  const isActionsTab = actions && actions.length !== 0;

  let firstSelectedTab = '';
  if (isGeneralTab) {
    firstSelectedTab = tabs.general.value;
  } else if (isValidationsTab) {
    firstSelectedTab = tabs.validations.value;
  } else if (isActionsTab) {
    firstSelectedTab = tabs.actions.value;
  }

  const createTabItems = (data, key) => {
    return data && key && data.length !== 0
      ? data.map((item = {}) => ({
          ...item,
          match: {
            ...item.match,
            editTab: {
              validators: [
                {
                  type: 'equals',
                  matchValue: key,
                },
              ],
            },
          },
        }))
      : [];
  };

  return {
    pageData: {
      ...pageData,
      init: {
        ...pageData.init,
        advanced: false,
        main: {
          editTab: firstSelectedTab,
        },
      },
      items: [
        {
          component: 'Wrapper',
          bodyClassName: 'text-right',
          items: [
            {
              component: 'Switch',
              name: 'advanced',
              label: 'Advanced Mode',
            },
          ],
        },

        {
          component: 'FormObject',
          name: 'main',
          match: {
            advanced: {
              validators: [
                {
                  type: 'equals',
                  matchValue: true,
                },
              ],
            },
          },
        },

        {
          component: 'Form',
          name: 'main',
          fields: [
            {
              name: 'editTab',
              cmpType: 'Tabs',
              className: 'mb-wide',
              options: [...(isGeneralTab ? [tabs.general] : []), ...(isValidationsTab ? [tabs.validations] : []), ...(isActionsTab ? [tabs.actions] : []), tabs.match],
              match: {
                advanced: {
                  validators: [
                    {
                      type: 'equals',
                      matchValue: false,
                    },
                  ],
                },
              },
            },

            ...createTabItems(finalGeneral, tabs.general.value),
            ...createTabItems(finalValidations, tabs.validations.value),
            ...createTabItems(actions, tabs.actions.value),
            ...createTabItems(defaultMatch, tabs.match.value),
          ],
          match: {
            advanced: {
              validators: [
                {
                  type: 'equals',
                  matchValue: false,
                },
              ],
            },
          },
        },
        ...(pageData.items ? pageData.items : []),
        {
          component: 'Wrapper',
          bodyClassName: '',
          items: [
            {
              component: 'Button',
              actionType: 'submit-event',
              buttonText: 'Save',
              size: 'medium',
              params: {
                '...main': '.main',
                ...saveParams,
              },
            },
            {
              component: 'Button',
              actionType: 'cancel-event',
              buttonText: 'Cancel',
              variant: 'outlined',
              size: 'medium',
            },
          ],
        },
      ],
    },
  };
};
