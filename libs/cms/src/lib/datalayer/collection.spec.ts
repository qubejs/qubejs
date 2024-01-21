import { mocks } from '../../../test';
import Collection from './collection';

describe('Core:DataLayer:Collection', () => {
  let fakeMOdel;
  beforeEach(() => {
    fakeMOdel == mocks.MockModel;
  });
  afterEach(() => {});

  describe('Basic', () => {
    it('should be defined', async () => {
      const repo = new Collection({ model: mocks.MockModel });
      expect(repo).toBeDefined();
    });
  });
  describe('insert(data)', () => {
    beforeEach(() => {});
    afterEach(() => {
      mocks.MockModel.setError(false);
    });
    it('should  call contructor and save method', function (done) {
      mocks.MockModel.setError(true);

      const coll = new Collection({ model: mocks.MockModel });
      coll.insert({ rec: 1 }).catch((err) => {
        expect(err.message).toBe('error occured');
        done();
      });
    });
    it('should  call save method', function (done) {
      const coll = new Collection({ model: mocks.MockModel });
      coll.insert({ update: '1' }).then((data) => {
        expect(data).toEqual({});
        done();
      });
    });
  });
  describe('find(criteria)', () => {
    beforeEach(() => {
      jest
        .spyOn(mocks.MockModel, 'findOne')
        .mockImplementation(() => Promise.resolve({ _doc: { name: 'test' } }));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should  call findOne method', function (done) {
      const coll = new Collection({ model: mocks.MockModel });
      coll.findOne({ update: '1' }).then((res) => {
        expect(res.name).toBe('test');
        done();
      });
    });
  });
  describe('aggregate(criteria)', () => {
    beforeEach(() => {
      jest
        .spyOn(mocks.MockModel, 'aggregate')
        .mockImplementation(() =>
          Promise.resolve([{ _doc: { name: 'test' } }])
        );
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should  call aggregate method', function (done) {
      const coll = new Collection({ model: mocks.MockModel });
      coll.aggregate({ update: '1' }).then((res) => {
        expect(res.length).toBe(1);
        done();
      });
    });
  });
  describe('find(criteria)', () => {
    beforeEach(() => {
      jest
        .spyOn(mocks.MockModel, 'find')
        .mockImplementation(() =>
          Promise.resolve([{ _doc: { name: 'test' } }])
        );
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should call find method and return _doc only', function (done) {
      const coll = new Collection({ model: mocks.MockModel });
      coll.find({ update: '1' }).then((res) => {
        expect(res[0].name).toBe('test');
        done();
      });
    });
  });
  describe('update(data)', () => {
    beforeEach(() => {
      jest
        .spyOn(mocks.MockModel, 'findOne')
        .mockImplementation(() => new mocks.MockModel({}) as any);
    });
    afterEach(() => {
      mocks.MockModel.setError(false);
      jest.restoreAllMocks();
    });
    it('should  call save method', function (done) {
      mocks.MockModel.setError(true);
      const coll = new Collection({ model: mocks.MockModel });
      coll.update({ update: '1' }, { update: '1' }).catch((err) => {
        expect(err.message).toBe('error occured');
        done();
      });
    });
    it('should  call save method', function (done) {
      const coll = new Collection({ model: mocks.MockModel });
      coll.update({ update: '1' }, { update: '1' }).then((data) => {
        expect(data).toEqual({});
        done();
      });
    });
  });
  describe('deleteOne(data)', () => {
    it('should throw error', function (done) {
      const model = mocks.createMockModel({}, []);
      const coll = new Collection({ model });
      model.setError(true);
      coll.deleteOne({ rec: 1 }).catch((err) => {
        expect(err.message).toBe('error occured');

        done();
      });
    });
    it('should not throw error', function (done) {
      const model = mocks.createMockModel({}, []);
      const coll = new Collection({ model });

      coll.deleteOne({ rec: 1 }).then((data) => {
        expect(data).toEqual({});
        done();
      });
    });
  });
  describe('deleteMany(data)', () => {
    it('should throw error', function (done) {
      const model = mocks.createMockModel({}, []);
      const coll = new Collection({ model });
      model.setError(true);
      coll.deleteMany({ rec: 1 }).catch((err) => {
        expect(err.message).toBe('error occured');

        done();
      });
    });
    it('should not throw error', function (done) {
      const model = mocks.createMockModel({}, []);
      const coll = new Collection({ model });

      coll.deleteMany({ rec: 1 }).then((data) => {
        expect(data).toEqual({});
        done();
      });
    });
  });
  describe('updateAll(data)', () => {
    let model;
    let mockRecords;
    beforeEach(async () => {
      model = mocks.createMockModel({}, []);
      const coll = new Collection({ model });
      mockRecords = [
        mocks.createMockModel({ id: '1', test: 'true' }),
        mocks.createMockModel({ id: '2', test: '2 true' }),
      ];
      jest.spyOn(mockRecords[0], 'save');
      jest.spyOn(mockRecords[1], 'save');
      jest
        .spyOn(model, 'find')
        .mockImplementation(() => Promise.resolve(mockRecords));
      await coll.updateAll({ rec: 1 }, { update: 1 });
    });

    it('should call save once', function () {
      expect(mockRecords[0].save).toHaveBeenCalledTimes(1);
    });
  });
  describe('updateAll(data) with error', () => {
    let model;
    let mockRecords;
    let result;
    beforeEach(async () => {
      model = mocks.createMockModel({}, []);
      const coll = new Collection({ model });
      mockRecords = [mocks.createMockModel({ id: '1', test: 'true' })];
      jest.spyOn(mockRecords[0], 'save');
      mockRecords[0].setError(true);
      jest
        .spyOn(model, 'find')
        .mockImplementation(() => Promise.resolve(mockRecords));
      await coll.updateAll({ rec: 1 }, { update: 1 }).catch((ex) => {
        result = ex;
      });
    });

    it('should  call .save once', function () {
      expect(mockRecords[0].save).toHaveBeenCalledTimes(1);
    });
    it('should throw error', function () {
      expect(result).toEqual({ message: 'error occured' });
    });
  });
});
