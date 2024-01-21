import BaseEntityCollection from './BaseEntityCollection';
import BaseEntity from './BaseEntity';

class TestEntity extends BaseEntity {
  constructor(raw) {
    super(
      {
        raw: raw,
        entityType: TestEntity,
      },
    );
  }
}

describe('BaseEntityCollection', () => {
  beforeEach(() => {});
  afterEach(() => {});

  describe('Basic', () => {
    it('should be defined', () => {
      const obj = new BaseEntityCollection();
      expect(obj).toBeDefined();
    });
  });

  describe('toArray()', () => {
    it('should return array with TestEntity object', () => {
      const obj = new BaseEntityCollection(
        [
          { uid: 'e5ks', text: 'Hallo 3' },
          { uid: 'e5ks1', text: 'Hallo 4' },
          { uid: 'e5ks2', text: 'Hallo 3' },
        ],
        TestEntity
      );
      expect(obj.toArray().length).toBe(3);
    });
  });
  describe('toObject()', () => {
    let entityColl, objectReturn;
    beforeEach(() => {
      entityColl = new BaseEntityCollection(
        [
          { uid: 'e5ks', text: 'Hallo 3' },
          { uid: 'e5ks1', text: 'Hallo 4' },
          { uid: 'e5ks2', text: 'Hallo 3' },
        ],
        TestEntity
      );
      objectReturn = entityColl.toObject('uid', 'text');
    });
    it('should convert array to an object with given field', () => {
      expect(objectReturn.e5ks).toBe('Hallo 3');
    });
    it('should able to access via get() method', () => {
      expect(objectReturn.get('e5ks')).toBe('Hallo 3');
    });
    it('should return NoValue in case there is no value', () => {
      expect(objectReturn.get('e5k333s')).toBe('NoValue');
    });
  });
  describe('toObject() with defaultValue', () => {
    let entityColl, objectReturn;
    beforeEach(() => {
      entityColl = new BaseEntityCollection(
        [
          { uid: 'e5ks', text: 'Hallo 3' },
          { uid: 'e5ks1', text: 'Hallo 4' },
          { uid: 'e5ks2', text: 'Hallo 3' },
        ],
        TestEntity
      );
      objectReturn = entityColl.toObject('uid', 'text', 'N/A');
    });

    it('should return NoValue in case there is no value', () => {
      expect(objectReturn.get('e5k333s')).toBe('N/A');
    });
  });
  describe('sortBy() with sort "asc & desc"', () => {
    let entityColl;
    beforeEach(() => {
      entityColl = new BaseEntityCollection(
        [
          { uid: 'u1', text: 'Abc' },
          { uid: 'u2', text: 'A1c' },
          { uid: 'u3', text: 'DD' },
          { uid: 'u3', text: 'Acord' },
        ],
        TestEntity
      );
    });

    it('should return sorted data by 1 field "text"', () => {
      const result = entityColl.sortBy('text');
      expect(result.data).toEqual([
        { uid: 'u2', text: 'A1c' },
        { uid: 'u1', text: 'Abc' },
        { uid: 'u3', text: 'Acord' },
        { uid: 'u3', text: 'DD' },
      ]);
    });
    it('should return sorted data by 2 field "text"', () => {
      const result = entityColl.sortOrder('uid').sortBy('text');
      expect(result.data).toEqual([
        { uid: 'u1', text: 'Abc' },
        { uid: 'u2', text: 'A1c' },
        { uid: 'u3', text: 'Acord' },
        { uid: 'u3', text: 'DD' },
      ]);
    });
    it('should return sorted data by 2 field "text" desc', () => {
      const result = entityColl.sortOrder('uid', 'desc').sortBy('text');
      expect(result.data).toEqual([
        { uid: 'u3', text: 'Acord' },
        { uid: 'u3', text: 'DD' },
        { uid: 'u2', text: 'A1c' },
        { uid: 'u1', text: 'Abc' },
      ]);
    });
    it('should return sorted data by 2 field "text"', () => {
      const result = entityColl.sortOrder('uid').sortBy('text', 'desc');
      expect(result.data).toEqual([
        { uid: 'u1', text: 'Abc' },
        { uid: 'u2', text: 'A1c' },
        { uid: 'u3', text: 'DD' },
        { uid: 'u3', text: 'Acord' },
      ]);
    });
    it('should return sorted data by data type number', () => {
      const newColl = new BaseEntityCollection(
        [
          { uid: 1, text: 'Abc' },
          { uid: 11, text: 'A1c' },
          { uid: 4, text: 'A1c' },
          { uid: 6, text: 'DD' },
          { uid: 2, text: 'Acord' },
        ],
        TestEntity
      );
      const result = newColl.sortBy('uid');
      expect(result.data).toEqual([
        { uid: 1, text: 'Abc' },
        { uid: 2, text: 'Acord' },
        { uid: 4, text: 'A1c' },
        { uid: 6, text: 'DD' },
        { uid: 11, text: 'A1c' },
      ]);
    });
  });
});
