class DynamoDocumentCollection {
  database: any;
  db: any;
  tableName: string;
  filterPrefix: string;
  constructor({ tableName, database, db }) {
    this.database = database;
    this.db = db;
    this.tableName = tableName;
    this.filterPrefix = 'fl_';
  }

  insert(data) {
    return this.db
      .put({
        TableName: this.tableName,
        Item: data,
      })
      .promise()
      .then(this.mapSingle);
  }

  find(criteria) {
    const params: any = {
      TableName: this.tableName,
    };
    if (criteria && Object.keys(criteria).length > 0) {
      params.FilterExpression = '';
      params.ExpressionAttributeNames = {};
      params.ExpressionAttributeValues = {};
      Object.keys(criteria).forEach((filterKey, idx) => {
        params.FilterExpression += `${params.FilterExpression ? ' and ' : ''}#${
          this.filterPrefix
        }${idx} = :${this.filterPrefix}${idx}`;
        params.ExpressionAttributeNames[`#${this.filterPrefix}${idx}`] =
          filterKey;
        params.ExpressionAttributeValues[`:${this.filterPrefix}${idx}`] =
          criteria[filterKey];
      });
    }
    return this.db.scan(params).promise().then(this.mapData);
  }

  mapSingle(data) {
    return data.Item;
  }

  mapData(data) {
    return data.Items.map((item) => item);
  }

  aggregate(criteria) {}
  findOne(criteria) {
    const params = {
      TableName: this.tableName,
      Key: criteria,
    };
    return this.db.get(params).promise().then(this.mapSingle);
  }

  deleteOne(criteria) {}
  deleteMany(criteria) {}

  async update(criteria, props) {}

  async updateAll(criteria, props) {}
}

export default DynamoDocumentCollection;
