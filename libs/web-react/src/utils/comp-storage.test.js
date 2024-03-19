import { GroupStorage, Storage, PreferenceStorage } from './comp-storage';

describe('utils:comp-storage', () => {
  describe('classess', function () {
    test('should have .PreferenceStorage', async () => {
      expect(PreferenceStorage).toBeDefined();
    });
    test('should have .Storage', async () => {
      expect(Storage).toBeDefined();
    });
    test('should have .GroupStorage', async () => {
      expect(GroupStorage).toBeDefined();
    });
  });
  describe('Storage.get() should return all', function () {
    test('Storage.get() should return all object', async () => {
      const storage = new Storage({
        test: 123,
      });
      storage.set({
        a: 1,
        b: 3,
      });
      expect(storage.get()).toEqual({
        test: 123,
        a: 1,
        b: 3,
      });
    });
    test('Storage.add() should add 1 item', async () => {
      const storage = new Storage({
        test: 123,
      });
      storage.add('take', 2);
      expect(storage.get()).toEqual({
        test: 123,
        take: 2,
      });
    });
    test('Storage.remove(take) should add 1 item', async () => {
      const storage = new Storage({
        test: 123,
      });
      storage.add('take', 2);
      storage.remove('take');
      expect(storage.get()).toEqual({
        test: 123,
      });
    });
  });
  describe('GroupStorage.get() group is not matched', function () {
    let storage;
    beforeEach(() => {
      storage = new GroupStorage();
      storage.set({
        a: 1,
      });
    });
    test('GroupStorage.get("a") should return all object', async () => {
      expect(storage.get('a')).toEqual({ a: 1 });
    });
  });
  describe('GroupStorage.add(name, ) should add to default', function () {
    let storage;
    beforeEach(() => {
      storage = new GroupStorage();
      storage.add('b', 1);
    });
    test('GroupStorage.get("b") should return 1 object from default', async () => {
      expect(storage.get('b')).toEqual({b: 1});
    });
  });
  describe('GroupStorage.get("style") group is matched', function () {
    let storage;
    beforeEach(() => {
      storage = new GroupStorage({
        test: 1,
      });
      storage.set(
        {
          a: 1,
        },
        'style'
      );
    });
    test('GroupStorage.get("style") should return specific object', async () => {
      expect(storage.get('style')).toEqual({ a: 1 });
    });
  });
  describe('PreferenceStorage for default saving', function () {
    let storage;
    beforeEach(() => {
      storage = new PreferenceStorage();
      storage.setData({});
    });
    test('PreferenceStorage.read() should return blank object key if not matched', async () => {
      expect(storage.read('currentFilter')).toEqual({});
    });
    test('PreferenceStorage.read() should return undefined if not matched matched', async () => {
      expect(storage.read('currentFilter', true)).not.toBeDefined();
    });
    test('PreferenceStorage.write("abc", obj) should save preference in object', async () => {
      storage.write('abc', { a: 'b1' });
      expect(storage.read('abc')).toEqual({ a: 'b1' });
    });
    test('PreferenceStorage.write("abc", obj) should raise onWrite event', async () => {
      window.location.pathname = '/content/en/super';
      const fakeSpy = jest.fn();
      storage.events.subscribe('onWrite', fakeSpy);
      storage.write('current', { a: 'b1' });
      expect(fakeSpy).toHaveBeenCalledWith(`preference_current_content_en_super`, { a: 'b1' }, '/content/en/super', 'default');
      storage.events.unsubscribe('onWrite');
      expect(storage.read('current')).toEqual({ a: 'b1' });
    });
    test('PreferenceStorage.writeAll(obj) should able to write multiple preference', async () => {
      window.location.pathname = '/content/en/parking';
      storage.writeAll({ current: { a: 'b1' }, b: ['a', 'b'] });
      expect(storage.read('current')).toEqual({ a: 'b1' });
    });
    test('PreferenceStorage.writeAll(obj) should raise onWriteAll event', async () => {
      window.location.pathname = '/content/en/event';
      const fakeSpy = jest.fn();
      storage.events.subscribe('onWriteAll', fakeSpy);
      storage.writeAll({ current: { a: 'b1' }, b: ['a', 'b'] });
      expect(fakeSpy).toHaveBeenCalledWith({ preference_current_content_en_event: { a: 'b1' }, preference_b_content_en_event: ['a', 'b'] }, '/content/en/event', 'default');
      storage.events.unsubscribe('onWriteAll');
    });
  });
  describe('PreferenceStorage for named views', function () {
    let storage;
    beforeEach(() => {
      window.location.pathname = '/content/task';
      storage = new PreferenceStorage();
      storage.setNamedData({
        '/content/task': {
          'Park Users': {
            preference_stored_content_task: {
              v: 1,
            },
          },
        },
      });
    });

    afterEach(() => {
      window.location.pathname = 'test';
    });

    test('PreferenceStorage.readNamed(key, viewName) should return (blank object) key if not matched', async () => {
      window.location.pathname = '/uknown';
      expect(storage.readNamed('parkingviwe', 'Lowes Users')).toEqual({});
    });
    test('PreferenceStorage.readNamed(key, viewName, true) should return (undefined) key if not matched', async () => {
      window.location.pathname = '/uknown2';
      expect(storage.readNamed('parkingviwe', 'Lowes Users', true)).not.toBeDefined();
    });
    test('PreferenceStorage.readNamed(key, viewName) return preloaded data', async () => {
      console.log(storage);
      expect(storage.readNamed('stored', 'Park Users')).toEqual({ v: 1 });
    });
    test('PreferenceStorage.readNamed(key, viewName) return blank data if not found', async () => {
      expect(storage.readNamed('stored2', 'Park Users')).toEqual({});
    });
    test('PreferenceStorage.readNamed(key, viewName) return undefined if not found', async () => {
      expect(storage.readNamed('stored2', 'Park Users', true)).not.toBeDefined();
    });
    test('PreferenceStorage.setNamed(key, data, viewName) should set to named object', async () => {
      storage.writeNamed('currentFilter', { t: 1 }, 'CA Users');
      expect(storage.readNamed('currentFilter', 'CA Users')).toEqual({ t: 1 });
    });
    test('PreferenceStorage.writeNamed(key, data, viewName) should set to named object', async () => {
      window.location.pathname = '/new/route';
      storage.writeNamed('park', { t: 1 }, 'View Users');
      expect(storage.readNamed('park', 'View Users')).toEqual({ t: 1 });
    });
    test('PreferenceStorage.writeAllNamed(data, viewName) should set to named object', async () => {
      window.location.pathname = '/content/parking';
      storage.writeAllNamed(
        {
          taken: {
            p1: 1,
          },
          taken2: {
            p1: 1,
          },
        },
        'CA Users'
      );
      expect(storage.readNamed('taken', 'CA Users')).toEqual({ p1: 1 });
    });
    test('PreferenceStorage.getAllNames() should return all views', async () => {
      window.location.pathname = '/content/parking';
      storage.writeAllNamed(
        {
          taken2: {
            p1: 1,
          },
        },
        'CA Users'
      );
      storage.writeAllNamed(
        {
          taken2: {
            p1: 1,
          },
          taken: undefined,
        },
        'Barkley Users'
      );
      expect(storage.getAllNames()).toEqual(['CA Users', 'Barkley Users']);
    });
    test('PreferenceStorage.writeAllNamed(data, viewName) should raise event', async () => {
      window.location.pathname = '/content/parking22/state';
      const fakeFn = jest.fn();
      storage.events.subscribe('onWriteAllNamed', fakeFn);
      storage.writeAllNamed(
        {
          taken: {
            p1: 1,
          },
          taken2: {
            p1: 1,
          },
        },
        'CA Users'
      );
      expect(fakeFn).toBeCalledWith(
        {
          preference_taken_content_parking22_state: {
            p1: 1,
          },
          preference_taken2_content_parking22_state: {
            p1: 1,
          },
        },
        '/content/parking22/state',
        'CA Users'
      );
      storage.events.unsubscribe('onWriteAllNamed');
    });
  });
});
