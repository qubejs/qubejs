import { Validator } from './validator';

describe('Validator', () => {
 test('should be defined', () => {
    expect(Validator).toBeDefined();
  });
 test('should be able to create object', () => {
    expect(new Validator()).toBeDefined();
  });

  describe('custom parseMessage()', () => {
    let validator;
    beforeEach(
      function () {
        validator = new Validator({
          test: {
            validator: { type: 'required' }
          }
        },{ emptyObject: false });
        validator.setValues({
          test: '',
          test1: 'valid'
        });
        validator.validate('test');
        validator.validate('test1');
      }
    );

   test('should have "error" property with invalid value', function () {
      expect(validator.errors.test.error).toBe(true);
    });
   test('should have "errorMessage" property with invalid value', function () {
      expect(validator.errors.test.errorMessage).toBeDefined();
    });
   test('should have "error" property with valid value', function () {
      expect(validator.errors.test1).not.toBeDefined();
    });
  });
});
