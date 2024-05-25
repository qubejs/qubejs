import EventManager from './event-manager';

class Storage {
  components: any;
  helpers: any;
  constructor(components = {}) {
    this.components = components;
    this.helpers = {};
  }

  setHelpers(helpers) {
    this.helpers = {
      ...this.helpers,
      ...helpers,
    };
  }

  add(name, data) {
    this.components[name] = data;
  }

  get() {
    return this.components;
  }

  remove(key) {
    delete this.components[key];
  }

  set(newComps) {
    this.components = {
      ...this.components,
      ...newComps,
    };
  }
}

class GroupStorage {
  components: any;
  helpers: any;
  fns: any;
  constructor(components = {}) {
    this.components = {
      default: components,
    };
    this.fns = {};
  }

  setHelpers(helpers) {
    this.helpers = {
      ...this.helpers,
      ...helpers,
    };
  }

  add(name, data, group = 'default') {
    this.components[group][name] = data;
  }

  get(group) {
    return this.components[group] || this.components.default;
  }

  remove(group) {
    delete this.components[group];
  }

  getAll():any {
    let newObj = {};
    Object.keys(this.components).forEach((a) => {
      newObj = {
        ...newObj,
        ...this.components[a],
      };
    });
    return newObj;
  }

  set(newComps, group = 'default') {
    this.components = {
      ...this.components,
      [group]: {
        ...(this.components[group] || {}),
        ...newComps,
      },
    };
  }
}

export const getParseJSON = (obj, isNull) => {
  try {
    return typeof obj == 'string'
      ? JSON.parse(obj)
      : obj || (isNull ? undefined : {});
  } catch (e) {
    return obj || (isNull ? undefined : {});
  }
};

class PreferenceStorage {
  helpers: any;
  defaultPrefData: any;
  namedPrefData: any;
  preferenceName: string;
  userKey: string;
  _win: any;
  events: any;
  constructor() {
    this.helpers = {};
    this.preferenceName = 'preference_';
    this.userKey = '';
    this.defaultPrefData = null;
    this.namedPrefData = {};
    this._win = window;
    this.events = new EventManager();
  }

  setData(data) {
    this.defaultPrefData = data;
  }

  setUserKey(key) {
    this.userKey = key;
  }

  setNamedData(data) {
    this.namedPrefData = data;
  }

  ensureNoSlashStart(url) {
    if (url?.substr(0, 1) === '/') {
      return url.substr(1);
    } else {
      return url;
    }
  }

  getAllNames() {
    return Object.keys(this.namedPrefData[this.preferenceKey()] || {});
  }

  preferenceKey() {
    return this._win.location.pathname;
  }

  nameString(name) {
    return (name || '').split(' ').join('_').split('/').join('_');
  }

  getKey(prefix) {
    return `${this.preferenceName}${this.userKey ? `${this.userKey}_` : ''}${prefix || 'default'}_${this.nameString(
      this.ensureNoSlashStart(this.preferenceKey())
    )}`;
  }

  read(key, isNull?) {
    if (this.defaultPrefData) {
      return (
        this.defaultPrefData[this.getKey(key)] || (isNull ? undefined : {})
      );
    }
    return getParseJSON(
      this._win.localStorage.getItem(this.getKey(key)),
      isNull
    );
  }

  readString (key, isNull?) {
    let value;
    if (this.defaultPrefData) {
      value = this.defaultPrefData[this.getKey(key)] || (isNull ? undefined : {});
    } else {
      value = getParseJSON(this._win.localStorage.getItem(this.getKey(key)), isNull);
    }
    return typeof value === 'string' ? value : null;
  }

  write(key, data) {
    if (this.defaultPrefData) {
      this.defaultPrefData[this.getKey(key)] = data;
      this.events.emit(
        'onWrite',
        this.getKey(key),
        data,
        this.preferenceKey(),
        'default'
      );
      return;
    }
    data &&
      this._win.localStorage.setItem(this.getKey(key), JSON.stringify(data));
  }
  writeAll(obj) {
    const objToSend = {};
    Object.keys(obj).forEach((itemKey) => {
      objToSend[this.getKey(itemKey)] = obj[itemKey] || '';
    });
    if (this.defaultPrefData) {
      Object.keys(objToSend).forEach((itemKey) => {
        this.defaultPrefData[itemKey] = objToSend[itemKey];
      });
      this.events.emit(
        'onWriteAll',
        objToSend,
        this.preferenceKey(),
        'default'
      );
      return;
    }
    Object.keys(objToSend).forEach((itemKey) => {
      const data = objToSend[itemKey] || {};
      this._win.localStorage.setItem(itemKey, JSON.stringify(data));
    });
  }

  readNamed(key, name, isNull) {
    if (
      this.namedPrefData[this.preferenceKey()] &&
      this.namedPrefData[this.preferenceKey()][name]
    ) {
      return (
        this.namedPrefData[this.preferenceKey()][name][this.getKey(key)] ||
        (isNull ? undefined : {})
      );
    }
    return isNull ? undefined : {};
  }

  writeNamed(key, data, name) {
    if (!this.namedPrefData[this.preferenceKey()]) {
      this.namedPrefData[this.preferenceKey()] = {};
    }
    if (!this.namedPrefData[this.preferenceKey()][name]) {
      this.namedPrefData[this.preferenceKey()][name] = {};
    }
    this.namedPrefData[this.preferenceKey()][name][this.getKey(key)] = data;
    this.events.emit(
      'onWriteNamed',
      this.getKey(key),
      data,
      this.preferenceKey(),
      name
    );
  }

  writeAllNamed(obj, name) {
    const objToSend = {};
    Object.keys(obj).forEach((itemKey) => {
      objToSend[this.getKey(itemKey)] = obj[itemKey] || {};
    });
    if (!this.namedPrefData[this.preferenceKey()]) {
      this.namedPrefData[this.preferenceKey()] = {};
    }
    if (!this.namedPrefData[this.preferenceKey()][name]) {
      this.namedPrefData[this.preferenceKey()][name] = {};
    }

    Object.keys(objToSend).forEach((itemKey) => {
      this.namedPrefData[this.preferenceKey()][name][itemKey] =
        objToSend[itemKey];
    });
    this.events.emit('onWriteAllNamed', objToSend, this.preferenceKey(), name);
    return;
  }

  setHelpers(helpers) {
    this.helpers = {
      ...this.helpers,
      ...helpers,
    };
  }

  clearData() {
    if (this.defaultPrefData) {
      this.defaultPrefData = null;
      Object.keys(this._win.localStorage.localStorage).forEach((key) => {
        if (key.startsWith(this.preferenceName)) {
          this._win.localStorage.localStorage.localStorage.removeItem(key);
        }
      });
    }
  }
}

export { Storage, GroupStorage, PreferenceStorage };
