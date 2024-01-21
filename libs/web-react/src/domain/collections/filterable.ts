import filter from 'lodash/filter';
import Querytable from './queryable';

class Filterable {
  rData: any[];
  entityType: any;
  constructor(data: any[] = [], { entityType = (data) => data } = {}) {
    this.rData = data;
    this.entityType = entityType;
  }

  filterBy(options) {
    return new Querytable(filter(this.rData, options), {
      entityType: this.entityType,
    });
  }
}

export default Filterable;
