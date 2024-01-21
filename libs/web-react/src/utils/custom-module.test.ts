import CustomModule from './custom-module';

describe('utils:CustomModule', () => {
  describe('CustomModule()', function () {
    test('should have defined', async () => {
      expect(CustomModule).toBeDefined();
    });
  });
  describe('Add Module', function () {
    let module;
    beforeEach(() => {
      module = new CustomModule();
      module.add('test', {
        addUser: (p1, p2) => {
          return 'test';
        },
      });
    });
    test('should be able to add module', async () => {
      expect(module.modules.test).toBeDefined();
    });
    test('should be able to add module', async () => {
      const result = await module.execute('test.addUser', 'test', 'in');
      expect(result).toEqual('test');
    });
  });
  describe('Add Async Module', function () {
    let module;
    beforeEach(() => {
      module = new CustomModule();
      module.add('test', {
        addUser: (response, action) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve({ test: true, p1: response, p2: action }), 100);
          });
        },
      });
    });
    test('should be able to execute async module', async () => {
      const result = await module.execute('test.addUser', 'test', 'in');
      expect(result.test).toEqual(true);
      expect(result.p1).toEqual('test');
    });
  });
  describe("If module don't exist Module", function () {
    let module;
    beforeEach(() => {
      module = new CustomModule();
    });
    test('should throw an error', async () => {
      let error;
      await module.execute('test.addUser', 'test', 'in').catch((ex) => {
        error = ex;
      });
      expect(error).toBe('test module not found');
    });
    test('should throw an error', async () => {
      module.add('test', {
        noName: (response, action) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve({ test: true, p1: response, p2: action }), 100);
          });
        },
      });
      let error;
      await module.execute('test.addUser', 'test', 'in').catch((ex) => {
        error = ex;
      });
      expect(error).toBe('test.addUser action not found');
    });
    test('should throw an error', async () => {
      module.add('test', {
        noName: (response, action) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve({ test: true, p1: response, p2: action }), 100);
          });
        },
      });
      let error;
      module.remove('test')
      await module.execute('test.addUser', 'test', 'in').catch((ex) => {
        error = ex;
      });
      expect(error).toBe('test module not found');
    });
  });
});
