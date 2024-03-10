import { customHooks } from './redux/content';
import { storage, format } from './utils';

const register = (plugin = {}) => {
  const {
    components = {},
    templates = {},
    containers = {},
    hooks = {},
    formatters = {},
    icons = {},
    dynamicComponents = {},
  }: any = plugin;
  storage.components.set(components);
  storage.containers.set(templates);
  storage.containers.set(containers);
  Object.keys(hooks).forEach((key) => {
    customHooks.add(key, hooks[key]);
  });
  formatters && format.setFormatters(formatters);
  icons && storage.icons.set(icons);
  dynamicComponents && storage.dynamicComponents.set(dynamicComponents);
};
/* export module */
export { register };
// export { storage, components };
