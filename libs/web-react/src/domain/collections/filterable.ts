import filter from 'lodash/filter';
class DefaultE {}

class Filterable {
  Queryable: any;
  rData: any[];
  entityType: any;
  constructor(
    data: any[] = [],
    {
      entityType = (data) => {
        return data;
      },
      Queryable = DefaultE,
    }
  ) {
    this.rData = data;
    this.entityType = entityType;
    this.Queryable = Queryable;
  }

  filterBy(options) {
    return new this.Queryable(filter(this.rData, options), {
      entityType: this.entityType,
    });
  }
}

export default Filterable;
