import apiBridge from '../../utils/api-bridge';
import Queryable from '../collections/queryable';
import { CONSTANTS } from '../../globals';

class Repository {
  typeOf:any;
  apiUrl:any;
  collection:any;

  constructor({ type, apiUrl, collection }) {
    this.typeOf = type;
    this.apiUrl = apiUrl;
    this.collection = collection;
    this.getEntity = this.getEntity.bind(this)
    this.getQueryable = this.getQueryable.bind(this)
  }

  createNew(raw) {
    return new this.typeOf(raw);
  }

  createCollection(data) {
    return new Queryable(data, { entityType: this.typeOf });
  }

  async get(params:any = {}, { type = 'get', url }:any = {}) {
    return await apiBridge[type](url || this.apiUrl, params);
  }

  async getOne(params, options:any = {}) {
    return await this.get(params, {
      ...options,
      type: 'post'
    }).then(this.getEntity.bind(this));
  }

  async getMany(params, options:any = {}) {
    return await this.get(params, {
      ...options,
      type: 'post'
    }).then(this.getQueryable);
  }

  async create(params:any = {}, { url }:any = {}) {
    return await apiBridge.post(url || this.apiUrl, params).then(this.getEntity);
  }

  async search(params, { url }:any = {}) {
    return await apiBridge.post(url || this.apiUrl, params).then(this.getQueryable);
  }

  getEntity(response) {
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      return {
        ...response,
        data: new this.typeOf(response.data)
      };
    }
    return response;
  }

  toQueryable(data) {
    return new Queryable(data, { entityType: this.typeOf });
  }

  getQueryable(response:any, dataKey?:any) {
    if (response.status === CONSTANTS.STATUS.SUCCESS) {
      return {
        ...response,
        data: {
          ...response.data,
          [dataKey]: response.data[dataKey] ? new Queryable(response.data[dataKey], { entityType: this.typeOf }) : {}
        }
      };
    }
    return response;
  }

  async fetch(params, { url, dataKey = this.collection }:any = {}) {
    return await apiBridge.post(url || this.apiUrl, params).then((res) => this.getQueryable(res, dataKey));
  }

  async update(params, { url }:any = {}) {
    return await apiBridge.update(url || this.apiUrl, params).then(this.getEntity.bind(this));
  }

  async updateWithPost(params, { url }:any = {}) {
    return await apiBridge.post(url || this.apiUrl, params).then(this.getEntity.bind(this));
  }

  async delete(params, { url }:any = {}) {
    return await apiBridge.delete(url || this.apiUrl, params);
  }
  async deleteByUid(params, { url }:any = {}) {
    return await apiBridge.delete(url || this.apiUrl, { uid: params.uid });
  }

  async post(url, params) {
    return await apiBridge.post(url, params);
  }
  async postOne(url, params) {
    return await apiBridge.post(url, params).then(this.getEntity.bind(this));
  }
}

export default Repository;
