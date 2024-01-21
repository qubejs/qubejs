class CustomModuleManager {
  modules: any;
  constructor() {
    this.modules = {};
  }

  add(moduleName, actions) {
    if (!this.modules[moduleName]) {
      this.modules[moduleName] = {};
    }
    this.modules[moduleName] = {
      ...this.modules[moduleName],
      ...actions,
    };
  }

  remove(moduleName) {
    delete this.modules[moduleName];
  }

  async execute(moduleAction, ...params) {
    const actions = moduleAction.split('.');
    const moduleName = actions[0];
    const action = actions[1];
    let output;
    if (this.modules[moduleName]) {
      if (this.modules[moduleName][action]) {
        output = this.modules[moduleName][action].apply(this, params);
      } else {
        throw `${moduleName}.${action} action not found`;
      }
    } else {
      throw `${moduleName} module not found`;
    }
    return output;
  }
}

export default CustomModuleManager;
