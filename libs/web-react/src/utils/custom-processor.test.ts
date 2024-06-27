// import CustomProcessor from './custom-processor';
import { utils } from '@qubejs/core';
import { GlobalOptions } from '../globals';
const { CustomProcessor } = utils;
const TEST_OK_CANCEL = new GlobalOptions({
  OKAY: 'Ok',
  Cancel: 'Cancel',
});

describe('utils:CustomProcessor', () => {
  describe('CustomProcessor()', function () {
    test('should have defined', async () => {
      expect(CustomProcessor).toBeDefined();
    });
  });
  describe('Add Processor', function () {
    let module;
    beforeEach(() => {
      module = new CustomProcessor();
      module.add('math', {
        add: (p1, p2) => {
          return p1 + p2;
        },
      });
    });
    test('should be able to add math module', async () => {
      expect(module.processor.math).toBeDefined();
    });
    test('should be able to execute  module action', async () => {
      var result = module.execute('math.add', 1, 3);
      expect(result).toEqual(4);
    });
  });

  describe("If module don't exist Module", function () {
    let module;
    beforeEach(() => {
      module = new CustomProcessor();
    });
    test('should throw an error', async () => {
      expect(() => module.execute('test.addUser', 'test', 'in')).toThrowError(
        'test module not found'
      );
    });
    test('should throw an error', async () => {
      module.add('test', {
        noName: (response, action) => {
          return false;
        },
      });

      expect(() => module.execute('test.addUser', 'test', 'in')).toThrowError(
        'test.addUser action not found'
      );
    });
    test('should throw an error', async () => {
      module.add('test', {
        noName: (response, action) => {
          return false;
        },
      });
      module.remove('test');
      expect(() => module.execute('test.addUser', 'test', 'in')).toThrowError(
        'test module not found'
      );
    });
  });

  describe('globals::methods()', () => {
    let module;
    beforeEach(() => {
      module = new CustomProcessor();
      module.registerOptions({
        TEST_OK_CANCEL,
      });
    });
    test('global.options() should return all options in given set', () => {
      expect(module.execute('globals.options', 'TEST_OK_CANCEL').length).toBe(
        2
      );
    });
    test('global.getOptionArray() should return all options in for given key', () => {
      expect(
        module.execute('globals.getOptionArray', 'TEST_OK_CANCEL').length
      ).toBe(2);
    });
    test('global.getOptionArray() should return [] if key not matching', () => {
      expect(module.execute('globals.getOptionArray', 'OK').length).toBe(0);
    });
    test('global.getOption() should return one matching option', () => {
      expect(
        module.execute('globals.getOption', 'OKAY', {
          optionsName: 'TEST_OK_CANCEL',
        })
      ).toBe('Ok');
    });
    test('global.getOption() should return same value ', () => {
      expect(
        module.execute('globals.getOption', 'NOTFOUND', { optionsName: '222' })
      ).toBe('NOTFOUND');
    });
    test('global.filterOptions() should return all options in with filter', () => {
      expect(
        module.execute('globals.filterOptions', [{ test: 'OKAY' }], {
          optionsName: 'TEST_OK_CANCEL',
          valueField: 'test',
        }).length
      ).toBe(1);
    });
  });
});
