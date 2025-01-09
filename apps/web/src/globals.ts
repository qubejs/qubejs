import { globals, utils } from '@qubejs/web-react';

export const CONSTANTS = {
  ...globals.CONSTANTS,
};

export const GLOBAL_OPTIONS = {
  ...globals.GLOBAL_OPTIONS,
  templates: new globals.GlobalOptions({
    DASHBOARD: 'Dashboard',
    CONTENT: 'Content',
    HOMEPAGE: 'Homepage',
  }),
};
utils.processor.registerOptions(GLOBAL_OPTIONS);
