
class DefaultE {

}

class Sortable {
  rData: any[];
  entityType: any;
  Queryable: any;
  _sortOrder: any[];
  constructor(data:any[] = [], { entityType = DefaultE, Queryable = DefaultE } = {}) {
    this.rData = data;
    this.entityType = entityType;
    this._sortOrder = [];
    this.Queryable = Queryable;
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
    const data:any = this.rData.sort((a, b) => {
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
    return new this.Queryable(data, { entityType: this.entityType });
  }
}

export default Sortable;
