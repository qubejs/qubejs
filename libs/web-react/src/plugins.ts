import { storage } from './utils';

const register = (plugin = {}) => {
  const { components = {}, templates = {}, containers = {} }: any = plugin;
  storage.components.set(components);
  storage.containers.set(templates);
  storage.containers.set(containers);
};
/* export module */
export { register };
// export { storage, components };
