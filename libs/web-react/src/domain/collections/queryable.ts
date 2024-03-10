import Filterbale from './filterable';
import Sortable from './sortable';


class Queryable {
  rData: any[];
  entityType: any;
  constructor(data: any[] = [], { entityType = (data) => data } = {}) {
    this.rData = data;
    this.entityType = entityType;
  }

  filterBy(options) {
    return new Filterbale(this.rData, { entityType: this.entityType, Queryable }).filterBy(
      options
    );
  }

  sortBy(field, asc?) {
    return new Sortable(this.rData, { entityType: this.entityType, Queryable }).sortBy(
      field,
      asc
    );
  }

  sortOrder(field, asc?) {
    return new Sortable(this.rData, { entityType: this.entityType, Queryable }).sortOrder(
      field,
      asc
    );
  }

  toArray(derived = true) {
    return this.rData.map((item) => {
      const fix = new this.entityType(item);
      return fix.toJson ? fix.toJson(derived) : fix;
    });
  }

  toObject(key, value, defaultValue = '') {
    const obj = {};
    this.rData.forEach((item) => {
      obj[item[key]] = item[value];
    });
    return obj;
  }
}

export default Queryable;
