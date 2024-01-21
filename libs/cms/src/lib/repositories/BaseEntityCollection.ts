class BaseEntityCollection {
  data: any;
  _entityType: any;
  _sortOrder: any[];
  constructor(data = [], entityType?) {
    this.data = data;
    this._entityType = entityType;
    this._sortOrder = [];
  }

  sortOrder(field, order = 'asc') {
    this._sortOrder.push({
      field,
      order,
    });
    return this;
  }

  sortBy(field, order = 'asc') {
    this.sortOrder(field, order);
    const data = this.data.sort((a, b) => {
      let idx;
      for (let count = 0; count < this._sortOrder.length; count++) {
        const order = this._sortOrder[count].order;
        const field = this._sortOrder[count].field;
        let data1 = a[field];
        let data2 = b[field];
        if (typeof data1 === 'string') {
          data1 = data1.toLowerCase();
        }
        if (typeof data2 === 'string') {
          data2 = data2.toLowerCase();
        }
        if (data1 > data2) {
          idx = order === 'asc' ? 1 : -1;
          break;
        } else if (data1 < data2) {
          idx = order === 'asc' ? -1 : 1;
          break;
        } else {
          idx = 0;
        }
      }
      return idx;
    });
    this._sortOrder = [];
    return new BaseEntityCollection(data, { entityType: this._entityType });
  }
  toArray() {
    return this.data.map((dataItem) => {
      return new this._entityType(dataItem);
    });
  }

  toObject(key, value, defaultValue) {
    const obj: any = {};
    this.data.forEach((item) => {
      obj[item[key]] = item[value];
    });
    obj.get = (key) => {
      return obj[key] || defaultValue || 'NoValue';
    };
    return obj;
  }
}

export default BaseEntityCollection;
