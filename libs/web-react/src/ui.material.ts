import { ThemeProvider } from '@emotion/react';
import { storage } from './utils';
import * as components from './components';
import * as containers from './containers';
import templates from './templates';

storage.components.set({
  ...components,
});
storage.containers.set({
  ...containers,
  ...templates,
});
/* export module */
export { storage, containers, components, templates, ThemeProvider };
// export { storage, components };
