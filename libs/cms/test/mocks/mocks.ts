/* tslint:disable */
import { utils } from '@qubejs/core';

class MockMongoAPI {
  data: any;
  constructor(data) {
    this.data = data;
  }
  find() {
    return this;
  }
  update() {
    return this;
  }
  delete() {
    return this;
  }
  deleteOne() {
    return this;
  }
  insert() {
    return this;
  }
  then(callback) {
    callback(this.data);
  }
  return(data) {
    this.data = data;
    return this;
  }
}
class MockRepository {
  data: any;
  constructor(data, methods) {
    this.data = data;
    methods &&
      methods.forEach((method) => {
        this[method] = () => Promise.resolve(this.data);
      });
  }
  find() {
    return Promise.resolve(this.data);
  }
  update() {
    return Promise.resolve(this.data);
  }
  insert() {
    return Promise.resolve(this.data);
  }
  deleteMany() {
    return Promise.resolve(this.data);
  }
  aggregate() {
    return Promise.resolve(this.data);
  }
  deleteById() {
    return Promise.resolve(this.data);
  }
  create() {
    return Promise.resolve(this.data);
  }
  return(data) {
    this.data = data;
    return this;
  }
}

class NewMockModel {
  static errorMode: any = false;
  data: any;
  static data: any;
  errorMode: any;
  save: any;

  static findOne = function () {
    return Promise.resolve(NewMockModel.data);
  };
  static find = function () {
    return Promise.resolve(NewMockModel.data);
  };
  static deleteOne = function (cr, callback) {
    if (NewMockModel.errorMode) {
      callback({ message: 'error occured' });
    } else {
      callback(null, NewMockModel.data);
    }
  };
  static delete = function () {
    return Promise.resolve(NewMockModel.data);
  };
  static update = function () {
    return Promise.resolve(NewMockModel.data);
  };
  static insert = function () {
    return Promise.resolve(NewMockModel.data);
  };
  static aggregate = function () {
    return Promise.resolve(NewMockModel.data);
  };
  static return = function (data) {
    NewMockModel.data = data;
    return NewMockModel;
  };

  static setError(bool) {
    NewMockModel.errorMode = bool;
  }
  setError(bool) {
    this.errorMode = bool;
  }
  find() {
    return Promise.resolve(this.data);
  }
  findOne() {
    return Promise.resolve(this.data);
  }
  deleteOne(cr, callback) {
    if (this.errorMode) {
      callback({ message: 'error occured' });
    } else {
      callback(null, this.data);
    }
  }
  deleteMany(cr, callback) {
    if (this.errorMode) {
      callback({ message: 'error occured' });
    } else {
      callback(null, this.data);
    }
  }
  delete() {
    return Promise.resolve(this.data);
  }
  update() {
    return Promise.resolve(this.data);
  }
  insert() {
    return Promise.resolve(this.data);
  }

  return(data) {
    this.data = data;
    return this;
  }
  constructor(data, methods = []) {
    this.data = data;
    this.errorMode = false;
    this.save = function (callback) {
      if (NewMockModel.errorMode || this.errorMode) {
        callback({ message: 'error occured' });
      } else {
        callback(null, this.data);
      }
    };

    methods.forEach((method) => {
      this[method] = () => {
        if (NewMockModel.errorMode || this.errorMode) {
          return Promise.reject({ message: 'error occured' });
        }
        return Promise.resolve(this.data);
      };
    });
  }
}

class MockIo {
  listen() {
    return {
      use: () => {},
      sockets: {
        on: () => {},
      },
    };
  }
}

class MockClient {
  called: any[];
  id: string;
  lastCall: any;
  constructor(args: any = {}) {
    this.id = args.id || utils.guid();
    this.called = [];
    this.lastCall = undefined;
  }
  emit(...args) {
    this.called.push(args);
    this.lastCall = args;
  }
}

class MockEntity {
  data: any;
  constructor(data) {
    this.data = data;
  }
  toObject() {
    return this.data;
  }
}

class FakeEntity {
  data: any;
  constructor(data) {
    this.data = data;
    Object.assign(this, data);
  }

  toObject() {
    return this.data;
  }
}

export default {
  createMockMongoAPI: function (data) {
    return new MockMongoAPI(data);
  },
  createMockRepository: function (data, methods = []) {
    return new MockRepository(data, methods);
  },
  MockModel: NewMockModel,
  createMockModel: function (data, methods = []) {
    return new NewMockModel(data, methods);
  },
  createMockIo: function () {
    return new MockIo();
  },
  createMockClient: function (args) {
    return new MockClient(args);
  },
  createMockEntity(args) {
    return new MockEntity(args);
  },
  createFakeEntity(data) {
    return new FakeEntity(data);
  },
  createFakeCollection(data) {
    return data.map((item) => new FakeEntity(item));
  },
};
