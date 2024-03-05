import { ThemeProvider } from '@emotion/react';
import { storage } from './utils';
import * as containers from './containers';
import templates from './templates';

storage.containers.set({
  ...containers,
  ...templates,
});
/* export module */
export { storage, containers, templates, ThemeProvider };
// export { storage, components };
