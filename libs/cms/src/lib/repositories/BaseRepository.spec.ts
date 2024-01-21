import { utils } from '@qubejs/core';
import BaseRepository from './BaseRepository';
import { fakeDb } from '../../../test';
describe('BaseRepository', () => {
  describe('+ve Scenario', () => {
    let _db;
    beforeEach(() => {
      _db = fakeDb(['test']);
      jest
        .spyOn(utils.datetime, 'now')
        .mockImplementation(() =>
          utils.datetime.new('2020-01-12T10:00:00.000Z')
        );
      jest
        .spyOn(utils.datetime, 'new')
        .mockImplementation(() =>
          new utils.datetime.DateTime('2020-01-12T10:00:00.000Z')
        );
      // jest
      //   .spyOn(_db.collections.test, 'find')
      //   .mockImplementation(() => Promise.resolve([{ fakeId: 1 }]));
      // jest
      //   .spyOn(_db.collections.test, 'findOne')
      //   .mockImplementation(() => Promise.resolve({ fakeId: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'deleteMany')
      //   .mockImplementation(() => Promise.resolve({ fakeId: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'updateAll')
      //   .mockImplementation(() => Promise.resolve({ fakeId: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'deleteOne')
      //   .mockImplementation(() => Promise.resolve({ fakeId: 1 }));
      // // jest.spyOn(_db.collections.test, 'aggregate');
      // jest
      //   .spyOn(_db.collections.test, 'update')
      //   .mockImplementation(() => Promise.resolve({ fakeId: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'insert')
      //   .mockImplementation(() => Promise.resolve({ fakeId: 1 }));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('Basic', () => {
      it('should be defined', async () => {
        const repo = new BaseRepository({
          db: fakeDb(['test']),
        });
        expect(repo).toBeDefined();
      });
    });

    describe('find()', () => {
      it('should call collection.find()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.find({});
        expect(_db.collections.test.find).toHaveBeenCalledWith({});
      });
    });
    describe('deleteMany()', () => {
      it('should call collection.deleteMany()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.deleteMany({});
        expect(_db.collections.test.deleteMany).toHaveBeenCalledWith({});
      });
    });
    describe('updateBulk()', () => {
      it('should call collection.updateBulk()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.updateBulk({});
        expect(_db.collections.test.updateAll).toHaveBeenCalledWith({}, {
          updatedOn: new Date('2020-01-12T10:00:00.000Z'),
        });
      });
    });
    describe('createObject()', () => {
      class FakeEntity {
        test: string;
        constructor() {
          this.test = '2';
        }
      };
      it('should call entity constructor', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
          entityType: FakeEntity,
        });
        const result = repo.createObject({});
        expect(result.test).toBe('2');
      });
    });
    describe('createCollection()', () => {
      const FakeEntity = class Test  {
        test: string;
        constructor() {
          this.test = '2';
        }
      };
      it('should call entity constructor', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
          entityType: FakeEntity,
        });
        const result = repo.createCollection([{}]);
        expect(result.toArray().length).toBe(1);
      });
    });
    describe('findOne()', () => {
      it('should call collection.findOne()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.findOne({});
        expect(_db.collections.test.findOne).toHaveBeenCalledWith({});
      });
    });
    describe('update()', () => {
      it('should call collection.update()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.update({});
        expect(_db.collections.test.update).toHaveBeenCalled();
      });
    });

    describe('deleteById()', () => {
      it('should call collection.deleteById()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.deleteById('123');
        expect(_db.collections.test.deleteOne).toHaveBeenCalledWith({
          _id: '123',
        });
      });
    });
    describe('insert()', () => {
      it('should call collection.insert()', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.insert({ x: 1, y: 2 });
        expect(_db.collections.test.insert).toHaveBeenCalledWith({
          x: 1,
          y: 2,
        });
      });
    });
    describe('aggregate()', () => {
      it('should call collection.aggregate() with $match', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.aggregate({
          match: { a: 1 },
        });
        expect(_db.collections.test.aggregate).toHaveBeenCalledWith([
          { $match: { a: 1 } },
        ]);
      });
      it('should call collection.aggregate() with $sort', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.aggregate({
          sort: { a: 1 },
        });
        expect(_db.collections.test.aggregate).toHaveBeenCalledWith([
          { $sort: { a: 1 } },
        ]);
      });
      it('should call collection.aggregate() with $group', async () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        await repo.aggregate({
          group: { _id: 1 },
        });
        expect(_db.collections.test.aggregate).toHaveBeenCalledWith([
          { $group: { _id: 1 } },
        ]);
      });
    });
  });

  describe('-ve Scenario', () => {
    let _db;
    beforeEach(() => {
      _db = fakeDb(['test']);
      jest
        .spyOn(utils.datetime, 'now')
        .mockImplementation(() =>
          utils.datetime.new('2020-01-12T10:00:00.000Z')
        );
      // jest
      //   .spyOn(_db.collections.test, 'find')
      //   .mockImplementation(() => Promise.resolve({ error: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'update')
      //   .mockImplementation(() => Promise.reject({ error: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'insert')
      //   .mockImplementation(() => Promise.reject({ error: 1 }));
      // jest
      //   .spyOn(_db.collections.test, 'aggregate')
      //   .mockImplementation(() => Promise.reject({ error: 1 }));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    describe('update() throws error', () => {
      it('should return db failed error', () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        return repo.update({}).catch((ex) => {
          expect(ex.key).toBe('DB_FAILED');
        });
      });
    });
    describe('insert() throws error', () => {
      it('should return db failed error', () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        return repo.insert({}).catch((ex) => {
          expect(ex.key).toBe('DB_FAILED');
        });
      });
    });
    describe('aggregate() throws error', () => {
      it('should return db failed error', () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        return repo.aggregate({}).catch((ex) => {
          expect(ex.key).toBe('DB_FAILED');
        });
      });
    });
    describe('aggregateMongo() throws error', () => {
      it('should return db failed error', () => {
        const repo = new BaseRepository({
          db: _db,
          collection: 'test',
        });
        return repo.aggregateMongo({}).catch((ex) => {
          expect(ex.key).toBe('DB_FAILED');
        });
      });
    });
  });
});
