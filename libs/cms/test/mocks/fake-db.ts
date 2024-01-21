const fakeCollections = (objRef: any = {}, coll) => {
  const { data = {} } = objRef;
  return {
    find: jest.fn(() => Promise.resolve(data[coll])),
    findOne: jest.fn(() => Promise.resolve(data[coll])),
    deleteOne: jest.fn(() => Promise.resolve(data[coll])),
    updateAll: jest.fn(() => Promise.resolve(data[coll])),
    deleteMany: jest.fn(() => Promise.resolve(data[coll])),
    update: jest.fn(() => Promise.resolve(data[coll])),
    insert: jest.fn(() => Promise.resolve(data[coll])),
    aggregate: jest.fn(() => Promise.resolve(data[coll])),
  };
};

export default (collections) => {
  const retObj = {
    data: {},
    connect: () => {
      console.log('fake connect');
    },
    collections: {},
    returns: (data) => {
      retObj.data = data;
      return retObj;
    },
  };
  collections.forEach((coll) => {
    retObj.collections[coll] = fakeCollections(retObj, coll);
  });
  return retObj;
};
