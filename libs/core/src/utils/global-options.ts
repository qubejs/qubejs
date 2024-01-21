class GlobalOptions {
  opts: any;
  keys: any;
  constructor(options) {
    this.opts = Object.assign({}, options);
    this.keys = {};
    Object.keys(this.opts).forEach((key) => {
      if (typeof this.opts[key] === 'object' && this.opts[key].key) {
        this.keys[key] = this.opts[key].key;
      } else {
        this.keys[key] = key;
      }
    });
  }

  get(key) {
    return this.opts[key] || {};
  }

  getProp(key, name) {
    if (typeof this.opts[key] === 'object') {
      return this.opts[key][name];
    } else {
      return this.opts[key];
    }
  }

  getText(key) {
    if (typeof this.opts[key] === 'object') {
      return this.opts[key].text;
    } else {
      return this.opts[key];
    }
  }

  fromData(data, { valueField = 'value' } = {}) {
    const values = (data || []).map((i) => i[valueField]);
    return this.toArray()
      .filter((i) => values.indexOf(i.value) > -1)
      .map((item) => {
        const dataItem = data.filter(
          (innerItem) => innerItem[valueField] === item.value
        )[0];
        return {
          ...item,
          ...dataItem,
        };
      });
  }

  toArray({ sortBy = '', sortOrder = 'asc' } = {}) {
    let result = Object.keys(this.opts).map((key) => {
      const {
        text,
        key: overrideKey = '',
        ...rest
      } = typeof this.opts[key] === 'string'
        ? { text: this.opts[key] }
        : this.opts[key];
      return {
        value: overrideKey || key,
        text: text || this.getText(key),
        ...rest,
      };
    });
    if (sortBy) {
      result = result.sort((a, b) => {
        if (a[sortBy]?.toLowerCase() > b[sortBy].toLowerCase()) {
          return sortOrder === 'asc' ? 1 : -1;
        } else if (a[sortBy] < b[sortBy]) {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          return 0;
        }
      });
    }
    return result;
  }
}
export { GlobalOptions };
