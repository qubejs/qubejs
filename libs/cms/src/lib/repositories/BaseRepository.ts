import filter from 'lodash/filter';
import { Errors as errors, utils } from '@qubejs/core';
import BaseEntity from './BaseEntity';
import BaseEntityCollection from './BaseEntityCollection';

const datetime = utils.datetime;

class BaseRepository {
  _entityType: any;
  _collectionEntity: any;
  _db: any;
  _collection: any;
  constructor({
    entityType = BaseEntity,
    collectionEntity = BaseEntityCollection,
    db,
    collection,
  }: any) {
    this._entityType = entityType;
    this._collectionEntity = collectionEntity;
    this._db = db;
    this._collection = collection;
    this._db.connect();
  }

  createObject(params):any  {
    return new this._entityType(params);
  }

  createCollection(data):any  {
    return new this._collectionEntity(data, this._entityType);
  }

  find(filter?, { sort }: any = {}):any  {
    return new Promise((resolve) => {
      let objFind = this._db.collections[this._collection].find(filter);
      if (sort) {
        objFind = objFind.sort(sort);
      }
      objFind.then((data) => {
        const coll = new this._collectionEntity(data, this._entityType);
        resolve(coll.toArray());
      });
    });
  }

  findOne(filter):any  {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .findOne(filter)
        .then((data) => {
          resolve(new this._entityType(data || {}));
        })
        .catch(reject);
    });
  }
  findById({ uid, ...filter }) :any {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .findOne({ _id: uid, ...filter })
        .then((data) => {
          resolve(new this._entityType(data || {}));
        })
        .catch(reject);
    });
  }

  deleteMany(filter):any  {
    return new Promise(async (resolve, reject) => {
      if (filter) {
        const result = await this._db.collections[this._collection]
          .deleteMany(filter)
          .catch(reject);
        resolve(result);
      } else {
        reject(errors.invalidopr());
      }
    });
  }

  deleteById(uid, filter?):any  {
    return new Promise(async (resolve, reject) => {
      let records;
      if (filter) {
        records = await this.find({ _id: uid, ...filter }).catch(reject);
      }
      if (!filter || !records || (records && records.length > 0)) {
        const result = await this._db.collections[this._collection]
          .deleteOne({ _id: uid })
          .catch(reject);
        resolve(result);
      } else {
        reject(errors.invalidopr());
      }
    });
    // return this._db.collections[this._collection].deleteOne({ _id: uid });
  }

  update(data):any  {
    const { uid, ...rest } = data;
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .update({ _id: uid }, { updatedOn: datetime.new().date(), ...rest })
        .then((doc) => {
          resolve(new this._entityType(doc));
        })
        .catch(() => {
          reject(errors.dbfailed());
        });
    });
  }
  updateBulk(filter, data?):any  {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .updateAll({ ...filter }, { updatedOn: datetime.new().date(), ...data })
        .then((data) => {
          resolve(new this._collectionEntity(data, this._entityType));
        })
        .catch(() => {
          reject(errors.dbfailed());
        });
    });
  }

  insert(data):any {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .insert(data)
        .then((res) => {
          resolve(new this._entityType(res));
        })
        .catch(() => {
          reject(errors.dbfailed());
        });
    });
  }

  mustExists(filter):any  {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection].find(filter).then((res) => {
        if (res.length === 0) {
          reject(errors.invalidopr());
        } else {
          resolve(res);
        }
      });
    });
  }

  checkExists(_filter, errorKeys = []):any  {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection].find(_filter).then((res) => {
        const buildErrors = {};
        if (res.length > 0) {
          errorKeys.forEach((filterKey) => {
            if (
              filter(res, (i) => i[filterKey] === _filter[filterKey]).length > 0
            ) {
              buildErrors[filterKey] = {
                error: true,
                errorMessage: 'This record already exists',
                key: 'DUPLICATE_RECORD',
              };
            }
          });
          reject(errors.duprecord(buildErrors));
        } else {
          resolve({});
        }
      });
    });
  }

  aggregateMongo(filter, options?) :any {
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .aggregate(filter, options)
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject(errors.dbfailed());
        });
    });
  }

  convertToBasicList(data) :any {
    return data.map((res) => {
      return {
        ...res._doc,
        uid: res._doc._id,
      };
    });
  }

  mFind(filter, fields?, options?):any  {
    return this._db.collections[this._collection].mFind(
      filter,
      fields,
      options
    );
  }
  count(filter):any  {
    return this._db.collections[this._collection].count(filter);
  }

  async search(
    payload,
    { sortBy = 'createdOn', sortDir = 'ASC', pageSize = 25, pageNo = 1 } = {}
  ):Promise<any>  {
    pageSize = pageSize * 1;
    pageNo = pageNo * 1;
    const count = await this.count(payload);
    const res = await this.mFind(payload)
      .limit(pageSize)
      .skip(pageSize * (pageNo - 1))
      .sort(`${sortDir === 'DESC' ? '-' : ''}${sortBy}`)
      .then(this.convertToBasicList);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      pageSize,
      currentPage: pageNo,
      data: res,
    };
  }

  aggregate({ match, sort, addFields, group, lookup }: any):any  {
    const filter = [];
    if (sort) {
      filter.push({ $sort: sort });
    }
    if (addFields) {
      filter.push({ $addFields: addFields });
    }
    if (match) {
      filter.push({ $match: match });
    }
    if (group) {
      filter.push({
        $group: group,
      });
    }
    if (lookup) {
      filter.push({
        $lookup: lookup,
      });
    }
    return new Promise((resolve, reject) => {
      this._db.collections[this._collection]
        .aggregate(filter)
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject(errors.dbfailed());
        });
    });
  }
}

export default BaseRepository;
