import * as utils from './index';
const { Validator, getValidators, addValidator } = utils.validator;
const validators = getValidators();
describe('Validator', () => {
  it('should be defined', () => {
    expect(Validator).toBeDefined();
  });
  it('should be able to create object', () => {
    expect(new Validator()).toBeDefined();
  });

  describe('Validator:Basic without configuration', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator();
    });
    it('validate(name) should return true', () => {
      expect(validator.validate('custom')).toBe(true);
    });
    it('validateAll() should return true', () => {
      expect(validator.validateAll()).toBe(true);
    });
  });
  describe('Validator:Custom validators', () => {
    let validator;
    beforeEach(() => {
      addValidator('test', () => false);
      validator = new Validator({
        test: {
          validator: { type: 'test' },
        },
      });
    });
    it('validate(name) should return true', () => {
      expect(validator.validate('test')).toBe(false);
    });
  });

  describe('errors format', () => {
    let validator;
    beforeEach(function () {
      validator = new Validator(
        {
          test: {
            validator: { type: 'required' },
          },
          testDefault: {
            validator: { type: 'required', defaultValue: 'None' },
          },
        },
        { emptyObject: false }
      );
      validator.setValues({
        test: '',
        test1: 'valid',
        testDefault: 'None',
      });
      validator.validate('test');
      validator.validate('test1');
      validator.validate('testDefault');
    });

    it('should have "error" property with invalid value', function () {
      expect(validator.errors.test.error).toBe(true);
    });
    it('should have "errorMessage" property with invalid value', function () {
      expect(validator.errors.test.errorMessage).toBeDefined();
    });
    it('should have "error" property with valid value', function () {
      expect(validator.errors.test1).toBeUndefined();
    });
    it('should have "error" property with valid value', function () {
      expect(validator.errors.testDefault.error).toBe(true);
    });
    it('should have "errorMessage" property with invalid value', function () {
      expect(validator.errors.testDefault.errorMessage).toBeDefined();
    });
  });

  describe('Default "errorMessage"', () => {
    let validator;
    beforeEach(function () {
      validator = new Validator({
        required: {
          validator: { type: 'required' },
        },
        requiredWithFn: {
          validator: { type: 'required', required: (fields) => true },
        },
        requiredWithFnNR: {
          validator: { type: 'required', required: (fields) => false },
        },
        password: {
          validator: { type: 'password' },
        },
        email: {
          validator: { type: 'email' },
        },
        phone: {
          validator: { type: 'phone' },
        },
        number: {
          validators: [{ type: 'required' }, { type: 'number', min: 1 }],
        },
        numberOptional: {
          validators: [{ type: 'number', min: 1, optional: true }],
        },
      });
      validator.setValues({
        requiredWithFn: '',
        required: '',
        password: 'Abc',
        email: 'testg.com',
        phone: '99107027650',
        number: '',
      });
    });

    it('type:"required" should have "This field is required"', function () {
      validator.validate('required');
      expect(validator.errors.required.errorMessage).toBe(
        'This field is required'
      );
    });
    it('type:"requiredWithFn" should have "This field is required"', function () {
      validator.validate('requiredWithFn');
      expect(validator.errors.requiredWithFn.errorMessage).toBe(
        'This field is required'
      );
    });
    it('type:"requiredWithFnNR" should have no message', function () {
      validator.validate('requiredWithFnNR');
      expect(validator.errors.required).toBeUndefined();
    });
    it('type:"password" should have "Password should be 6 characters long"', function () {
      validator.validate('password');
      expect(validator.errors.password.errorMessage).toBe(
        'Password should be 6 characters long'
      );
    });
    it('type:"email" should have "Enter a valid email"', function () {
      validator.validate('email');
      expect(validator.errors.email.errorMessage).toBe('Enter a valid email');
    });
    it('type:"phone" should have "Enter a valid phone number"', function () {
      validator.validate('phone');
      expect(validator.errors.phone.errorMessage).toBe(
        'Enter a valid phone number'
      );
    });
    it('type:"number" should have "Enter a valid phone number"', function () {
      validator.validate('number');
      expect(validator.errors.number.errorMessage).toBe(
        'This field is required'
      );
    });
    it('type:"numberOptional" should have no message', function () {
      validator.validate('numberOptional');
      expect(validator.errors.numberOptional).toEqual({});
    });
  });
  describe('Custom "errorMessage"', () => {
    let validator;
    const config = {
      required: {
        validator: { type: 'required', message: 'Custom required' },
      },
      password: {
        validator: { type: 'password', message: 'Custom password' },
      },
      email: {
        validator: { type: 'email', message: 'Custom email' },
      },
      phone: {
        validator: { type: 'phone', message: 'Custom phone' },
      },
    };
    beforeEach(function () {
      validator = new Validator(config);
      validator.setValues({
        required: '',
        password: 'Abc',
        email: 'testg.com',
        phone: '9910',
      });
    });

    it(`type:"required" should have "${config.required.validator.message}"`, function () {
      validator.validate('required');
      expect(validator.errors.required.errorMessage).toBe(
        config.required.validator.message
      );
    });
    it(`type:"password" should have "${config.password.validator.message}"`, function () {
      validator.validate('password');
      expect(validator.errors.password.errorMessage).toBe(
        config.password.validator.message
      );
    });
    it(`type:"email" should have "${config.email.validator.message}"`, function () {
      validator.validate('email');
      expect(validator.errors.email.errorMessage).toBe(
        config.email.validator.message
      );
    });
    it(`type:"phone" should have "${config.phone.validator.message}"`, function () {
      validator.validate('phone');
      expect(validator.errors.phone.errorMessage).toBe(
        config.phone.validator.message
      );
    });
  });

  describe("type:'required'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        test: {
          validator: { type: 'required' },
        },
      });
    });
    it("validate(name) should return false in case of '' (blank value)", () => {
      validator.setValue('test', '');
      expect(validator.validate('test')).toBe(false);
    });

    it("validate(name) should return false in case of ' ' (blank with space)", () => {
      validator.setValue('test', ' ');
      expect(validator.validate('test')).toBe(false);
    });

    it('validate(name) should return false in case of null', () => {
      validator.setValue('test', null);
      expect(validator.validate('test')).toBe(false);
    });
    it('validate(name) should return false in case of undefined', () => {
      validator.setValue('test', undefined);
      expect(validator.validate('test')).toBe(false);
    });
    it("validate(name) should return true with value ='abc'", () => {
      validator.setValue('test', 'abc');
      expect(validator.validate('test')).toBe(true);
    });
    it('validate(name) should return true with value=123', () => {
      validator.setValue('test', 123);
      expect(validator.validate('test')).toBe(true);
    });
    it('validate(name) should return true with value=0', () => {
      validator.setValue('test', 0);
      expect(validator.validate('test')).toBe(true);
    });
  });

  describe("type:'requiredArray'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        test: {
          validator: { type: 'requiredArray' },
        },
        yes: {
          validator: { type: 'requiredArray', required: () => false },
        },
      });
    });
    it("validate(name) should return false in case of '' (blank value)", () => {
      validator.setValue('test', '');
      expect(validator.validate('test')).toBe(false);
    });

    it('validate(name) should return false in case of []', () => {
      validator.setValue('test', []);
      expect(validator.validate('test')).toBe(false);
    });

    it('validate(name) should return false in case of null', () => {
      validator.setValue('test', null);
      expect(validator.validate('test')).toBe(false);
    });
    it('validate(name) should return false in case of undefined', () => {
      validator.setValue('test', undefined);
      expect(validator.validate('test')).toBe(false);
    });
    it('validate(name) should return true with string', () => {
      validator.setValue('test', ['est']);
      expect(validator.validate('test')).toBe(true);
    });
    it('validate(name) should return true with object', () => {
      validator.setValue('test', [{ key: 1 }]);
      expect(validator.validate('test')).toBe(true);
    });
    it('validate(name) should return true if not required (e.g required() return false)', () => {
      validator.setValue('yes', []);
      expect(validator.validate('yes')).toBe(true);
    });
  });

  describe("type:'email'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        test: {
          validator: { type: 'email' },
        },
      });
    });
    it("validate(email) should return false in case of '' (blank value)", () => {
      validator.setValue('test', '');
      expect(validator.validate('test')).toBe(true);
    });

    it("validate(email) should return false in case of ' ' (blank with space)", () => {
      validator.setValue('test', ' ');
      expect(validator.validate('test')).toBe(true);
    });

    it('validate(email) should return false in case of null', () => {
      validator.setValue('test', null);
      expect(validator.validate('test')).toBe(true);
    });
    it('validate(email) should return false in case of undefined', () => {
      validator.setValue('test', undefined);
      expect(validator.validate('test')).toBe(true);
    });
    it("validate(email) should return false with value ='navneet@'", () => {
      validator.setValue('test', 'navneet@');
      expect(validator.validate('test')).toBe(false);
    });
    it("validate(name) should return true with value='navneet@ss.'", () => {
      validator.setValue('test', 'navneet@ss.');
      expect(validator.validate('test')).toBe(false);
    });
    it("validate(name) should return true with value='navneet@abhc.com'", () => {
      validator.setValue('test', 'navneet@abhc.com');
      expect(validator.validate('test')).toBe(true);
    });
  });

  describe('error message with .errorKey', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        email1: {
          validator: { type: 'email', key: 'ERROR_KEY' },
        },
        email2: {
          validators: [{ type: 'email', key: 'ERROR_KEY' }],
        },
      });
    });
    it('validate(email1) should return .errorKey = ERROR_KEY', () => {
      validator.setValue('email1', 'navneet@');
      validator.validate('email1');
      expect(validator.errors.email1.key).toBe('ERROR_KEY');
    });
    it('validate(email2) should return .errorKey = ERROR_KEY', () => {
      validator.setValue('email2', 'navneet@');
      validator.validate('email2');
      expect(validator.errors.email2.key).toBe('ERROR_KEY');
    });
  });

  describe("type:'compareField'", () => {
    describe('with options { compare as = } defaultValue', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          password: {
            validator: { type: 'compareField', fieldName: 'confirmPassword' },
          },
        });
      });
      it('should return true when both fields are blank', () => {
        validator.setValue('password', '');
        validator.setValue('confirmPassword', '');
        expect(validator.validate('password')).toBe(true);
      });
      it('should return true when one is blank other is not set', () => {
        validator.setValue('password', '');
        expect(validator.validate('password')).toBe(true);
      });
      it('should return true when both are same', () => {
        validator.setValue('password', 'Abc');
        validator.setValue('confirmPassword', 'Abc');
        expect(validator.validate('password')).toBe(true);
      });

      it('should return false when both value are not same', () => {
        validator.setValue('password', 'a');
        validator.setValue('confirmPassword', 'Abc');
        expect(validator.validate('password')).toBe(false);
      });
    });
    describe('with options { compare as != }', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          password: {
            validator: {
              type: 'compareField',
              fieldName: 'confirmPassword',
              compare: '!=',
            },
          },
        });
      });
      it('should return false when both fields are blank', () => {
        validator.setValue('password', '');
        validator.setValue('confirmPassword', '');
        expect(validator.validate('password')).toBe(false);
      });
      it('should return false when one is blank other is not set', () => {
        validator.setValue('password', '');
        expect(validator.validate('password')).toBe(false);
      });
      it('should return false when both are no set', () => {
        expect(validator.validate('password')).toBe(false);
      });
      it('should return true when both value are not same', () => {
        validator.setValue('password', 'a');
        validator.setValue('confirmPassword', 'Abc');
        expect(validator.validate('password')).toBe(true);
      });
    });
    describe('with options { compare as =, trim = true }', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          password: {
            validator: {
              type: 'compareField',
              fieldName: 'confirmPassword',
              compare: '=',
              trim: true,
            },
          },
        });
      });

      it('should return true when both fields are blank with spaces', () => {
        validator.setValue('password', ' ');
        validator.setValue('confirmPassword', '  ');
        expect(validator.validate('password')).toBe(true);
      });
      it('should return true when both value are same without spaces', () => {
        validator.setValue('password', 'Abc  ');
        validator.setValue('confirmPassword', 'Abc');
        expect(validator.validate('password')).toBe(true);
      });
    });
    describe('with options { compare as "invalid}', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          password: {
            validator: {
              type: 'compareField',
              fieldName: 'confirmPassword',
              compare: 'invalid',
            },
          },
        });
      });

      it('should ignore return true', () => {
        validator.setValue('password', ' ');
        validator.setValue('confirmPassword', '  ');
        expect(validator.validate('password')).toBe(true);
      });
    });
  });

  describe("type:'number'", () => {
    describe('only number', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          age: {
            validator: { type: 'number' },
          },
        });
      });
      it("should return false when value=''", () => {
        validator.setValue('age', '');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='ab'", () => {
        validator.setValue('age', 'ab');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='12f'", () => {
        validator.setValue('age', '12f');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return true when value='12'", () => {
        validator.setValue('age', '12');
        expect(validator.validate('age')).toBe(true);
      });
      it("should return true when value='12.09'", () => {
        validator.setValue('age', '12.09');
        expect(validator.validate('age')).toBe(true);
      });
    });
    describe('only number with min', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          age: {
            validator: { type: 'number', min: 10 },
          },
        });
      });
      it("should return false when value=''", () => {
        validator.setValue('age', '');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='9'", () => {
        validator.setValue('age', '9');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='9.99'", () => {
        validator.setValue('age', '9.99');
        expect(validator.validate('age')).toBe(false);
      });

      it("should return true when value='11'", () => {
        validator.setValue('age', '11');
        expect(validator.validate('age')).toBe(true);
      });
      it("should return true when value='10.01'", () => {
        validator.setValue('age', '10.01');
        expect(validator.validate('age')).toBe(true);
      });
    });
    describe('only number with max', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          age: {
            validator: { type: 'number', max: 10 },
          },
        });
      });
      it("should return false when value=''", () => {
        validator.setValue('age', '');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return true when value='9'", () => {
        validator.setValue('age', '9');
        expect(validator.validate('age')).toBe(true);
      });
      it("should return true when value='9.99'", () => {
        validator.setValue('age', '9.99');
        expect(validator.validate('age')).toBe(true);
      });

      it("should return false when value='11'", () => {
        validator.setValue('age', '11');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='10.01'", () => {
        validator.setValue('age', '10.01');
        expect(validator.validate('age')).toBe(false);
      });
    });
    describe('only number with min max both', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          age: {
            validator: { type: 'number', min: 5, max: 10 },
          },
        });
      });

      it("should return false when value='4'", () => {
        validator.setValue('age', '4');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='4.99'", () => {
        validator.setValue('age', '4.99');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return true when value='9.99'", () => {
        validator.setValue('age', 9.99);
        expect(validator.validate('age')).toBe(true);
      });

      it("should return false when value='11'", () => {
        validator.setValue('age', '11');
        expect(validator.validate('age')).toBe(false);
      });
      it("should return false when value='10.01'", () => {
        validator.setValue('age', '10.01');
        expect(validator.validate('age')).toBe(false);
      });
    });
  });

  describe("type:'length'", () => {
    describe('with options {min }', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          name: {
            validator: { type: 'length', min: 1 },
          },
        });
      });
      it("validate(name) should return false in case of '' (blank value)", () => {
        validator.setValue('name', '');
        expect(validator.validate('name')).toBe(false);
      });
      it("validate(name) should return true in case of 'a'", () => {
        validator.setValue('name', 'a');
        expect(validator.validate('name')).toBe(true);
      });
    });
    describe('with options {max }', () => {
      let validator;
      beforeEach(() => {
        validator = new Validator({
          name: {
            validator: { type: 'length', max: 10 },
          },
        });
      });
      it("validate(name) should return true in case of '' (blank value)", () => {
        validator.setValue('name', '');
        expect(validator.validate('name')).toBe(true);
      });
      it("validate(name) should return false in case of 'asksksksksk'", () => {
        validator.setValue('name', 'asksksksksk');
        expect(validator.validate('name')).toBe(false);
      });
      it("validate(name) should return true in case of 'asksksksks    '", () => {
        validator.setValue('name', 'asksksksks    ');
        expect(validator.validate('name')).toBe(true);
      });
    });
  });

  describe("type:'emailphone'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        phone: {
          validator: { type: 'emailphone' },
        },
      });
    });
    it("validate(phone) should return true in case of 'navneetabh@gmail.com' (email)", () => {
      validator.setValue('phone', 'navneetabh@gmail.com');
      expect(validator.validate('phone')).toBe(true);
    });
    it("validate(phone) should return true in case of '9910099101' (phone)", () => {
      validator.setValue('phone', '9910099101');
      expect(validator.validate('phone')).toBe(true);
    });
    it("validate(phone) should return false in case of '991009101' (invalid phone)", () => {
      validator.setValue('phone', '991009101');
      expect(validator.validate('phone')).toBe(false);
    });
    it("validate(phone) should return false in case of 'navneetabh@' (invalid email)", () => {
      validator.setValue('phone', 'navneetabh@');
      expect(validator.validate('phone')).toBe(false);
    });
  });
  describe("type:'emailinternationalphone'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        phone: {
          validator: { type: 'emailinternationalphone' },
        },
      });
    });
    it("validate(phone) should return true in case of 'navneetabh@gmail.com' (email)", () => {
      validator.setValue('phone', 'navneetabh@gmail.com');
      expect(validator.validate('phone')).toBe(true);
    });
    it("validate(phone) should return true in case of '+919910099101' (phone)", () => {
      validator.setValue('phone', '+919910099101');
      expect(validator.validate('phone')).toBe(true);
    });
    it("validate(phone) should return false in case of '991009101' (invalid phone)", () => {
      validator.setValue('phone', '991009101');
      expect(validator.validate('phone')).toBe(false);
    });
    it("validate(phone) should return false in case of 'navneetabh@' (invalid email)", () => {
      validator.setValue('phone', 'navneetabh@');
      expect(validator.validate('phone')).toBe(false);
    });
  });
  describe("type:'emailinternationalphone'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        phone: {
          validator: { type: 'emailinternationalphone' },
        },
      });
    });
    it("validate(phone) should return true in case of 'navneetabh@gmail.com' (email)", () => {
      validator.setValue('phone', 'navneetabh@gmail.com');
      expect(validator.validate('phone')).toBe(true);
    });
    it("validate(phone) should return true in case of '+919910099101' (phone)", () => {
      validator.setValue('phone', '+919910099101');
      expect(validator.validate('phone')).toBe(true);
    });
    it("validate(phone) should return false in case of '991009101' (invalid phone)", () => {
      validator.setValue('phone', '991009101');
      expect(validator.validate('phone')).toBe(false);
    });
    it("validate(phone) should return false in case of 'navneetabh@' (invalid email)", () => {
      validator.setValue('phone', 'navneetabh@');
      expect(validator.validate('phone')).toBe(false);
    });
  });

  describe("type:'or'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        multivalue: {
          validator: {
            type: 'or',
            validations: [{ type: 'email' }, { type: 'phone' }],
          },
        },
      });
    });
    it('validate(multivalue) should return true in case of email', () => {
      validator.setValue('multivalue', 'navnet@s.com');
      expect(validator.validate('multivalue')).toBe(true);
    });
    it('validate(multivalue) should return true in case of phone', () => {
      validator.setValue('multivalue', '9910702765');
      expect(validator.validate('multivalue')).toBe(true);
    });
    it('validate(multivalue) should return false in case of phone', () => {
      validator.setValue('multivalue', 'sdg');
      expect(validator.validate('multivalue')).toBe(false);
    });
  });
  describe("type:'and'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        multivalue: {
          validator: {
            type: 'and',
            validations: [{ type: 'email' }, { type: 'length', exact: 8 }],
          },
        },
      });
    });
    it('validate(multivalue) should return true in case of email', () => {
      validator.setValue('multivalue', 'et@s.com');
      expect(validator.validate('multivalue')).toBe(true);
    });
    it('validate(multivalue) should return false in case of email exceeding 8 chars', () => {
      validator.setValue('multivalue', 'et2@s.com');
      expect(validator.validate('multivalue')).toBe(false);
    });
  });
  describe("type:'equals' subType as '='", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        text: {
          validator: { type: 'equals', matchValue: 'test' },
        },
      });
    });
    it("validate(text) should return true in case of 'test' (text)", () => {
      validator.setValue('text', 'test');
      expect(validator.validate('text')).toBe(true);
    });
    it("validate(text) should return false in case of 'a' (text)", () => {
      validator.setValue('text', 'a');
      expect(validator.validate('text')).toBe(false);
    });
  });
  describe("type:'equals' with nested key value name", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        'text.special1': {
          validator: { type: 'equals', matchValue: 'ok' },
        },
      });
    });
    it("validate(text) should return true in case of 'test' (text)", () => {
      validator.setValues({
        text: {
          special1: 'ok',
        },
      });
      expect(validator.validate('text')).toBe(true);
    });
  });
  describe("type:'date'", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        date: {
          validator: { type: 'date' },
        },
      });
    });
    it('validate(date) should return true if valid date', () => {
      validator.setValue('date', '02-02-2022');
      expect(validator.validate('date')).toBe(true);
    });
    it("validate(date) should return false in case of 'a' ", () => {
      validator.setValue('date', 'a');
      expect(validator.validate('date')).toBe(false);
    });
  });

  describe("type:'options' with object array", () => {
    it('should return true if have matching value', () => {
      const validator = new Validator({
        timezone: {
          validator: {
            type: 'options',
            options: [{ value: 'IST', text: 'Indian standard' }],
          },
        },
      });
      validator.setValue('timezone', 'IST');
      expect(validator.validate('timezone')).toBe(true);
    });
    it('should return false if have if not matching value', () => {
      const validator = new Validator({
        timezone: {
          validator: {
            type: 'options',
            options: [{ value: 'IST', text: 'Indian standard' }],
          },
        },
      });
      validator.setValue('timezone', 'IST2');
      expect(validator.validate('timezone')).toBe(false);
    });
  });

  describe("type:'options' with string array", () => {
    it('should return true if have matching value', () => {
      const validator = new Validator({
        checkVal: {
          validator: { type: 'options', options: ['Rice', 'Core'] },
        },
      });
      validator.setValue('checkVal', 'Rice');
      expect(validator.validate('checkVal')).toBe(true);
    });
    it('should return false if have if not matching value', () => {
      const validator = new Validator({
        checkVal: {
          validator: { type: 'options', options: ['Rice', 'Core'] },
        },
      });
      validator.setValue('checkVal', 'Core2');
      expect(validator.validate('checkVal')).toBe(false);
    });
  });
  describe("type:'options' with optional = true", () => {
    it('should return true if have matching value', () => {
      const validator = new Validator({
        checkVal: {
          validator: {
            type: 'options',
            options: ['Rice', 'Core'],
            optional: true,
          },
        },
      });
      validator.setValue('checkVal', '');
      expect(validator.validate('checkVal')).toBe(true);
    });
  });
  describe("type:'options' with no options", () => {
    it('should return false if have no options', () => {
      const validator = new Validator({
        checkVal: {
          validator: { type: 'options', optional: true },
        },
      });
      validator.setValue('checkVal', 'Ground');
      expect(validator.validate('checkVal')).toBe(false);
    });
  });
  describe("type:'options' with unknown type", () => {
    it('should return false if have no options', () => {
      const validator = new Validator({
        checkVal: {
          validator: { type: 'options', optional: true, subType: 'object' },
        },
      });
      validator.setValue('checkVal', 'Ground');
      expect(validator.validate('checkVal')).toBe(false);
    });
  });

  describe("type:'options' with object array", () => {
    it('should return true if have matching value', () => {
      const validator = new Validator({
        timezone: {
          validator: {
            type: 'options',
            options: [{ value: 'IST', text: 'Indian standard' }],
          },
        },
      });
      validator.setValue('timezone', 'IST');
      expect(validator.validate('timezone')).toBe(true);
    });
    it('should return false if have if not matching value', () => {
      const validator = new Validator({
        timezone: {
          validator: {
            type: 'options',
            options: [{ value: 'IST', text: 'Indian standard' }],
          },
        },
      });
      validator.setValue('timezone', 'IST2');
      expect(validator.validate('timezone')).toBe(false);
    });
  });

  describe("type:'array'", () => {
    it('should return true if passed value is an array', () => {
      const validator = new Validator({
        timezone: {
          validator: { type: 'array' },
        },
      });
      validator.setValue('timezone', ['one']);
      expect(validator.validate('timezone')).toBe(true);
    });
    it('should return true if passed value is an array of strings', () => {
      const validator = new Validator({
        timezone: {
          validator: { type: 'array', valueType: 'string' },
        },
      });
      validator.setValue('timezone', ['one']);
      expect(validator.validate('timezone')).toBe(true);
    });
    it('should return false if passed value is an array of object', () => {
      const validator = new Validator({
        timezone: {
          validator: { type: 'array', valueType: 'string' },
        },
      });
      validator.setValue('timezone', [{ key: 'one' }]);
      expect(validator.validate('timezone')).toBe(false);
    });
  });

  describe("type:'equal' subType as '!='", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        text: {
          validator: { type: 'equals', matchValue: 'test', subType: '!=' },
        },
      });
    });
    it("validate(text) should return false in case of 'test' (text)", () => {
      validator.setValue('text', 'test');
      expect(validator.validate('text')).toBe(false);
    });
    it("validate(text) should return true in case of 'a' (text)", () => {
      validator.setValue('text', 'a');
      expect(validator.validate('text')).toBe(true);
    });
  });
  describe("type:'digits' without length", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        digits: {
          validator: { type: 'digits' },
        },
      });
    });
    it("validate(digits) should return false in case of '12030d' (digits)", () => {
      validator.setValue('digits', '12030d');
      expect(validator.validate('digits')).toBe(false);
    });
    it("validate(digits) should return true in case of '4577' (digits)", () => {
      validator.setValue('digits', '4577');
      expect(validator.validate('digits')).toBe(true);
    });
  });
  describe("type:'digits' with length", () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        digits: {
          validator: { type: 'digits', length: 2 },
        },
      });
    });
    it("validate(digits) should return false in case of '1234' (digits)", () => {
      validator.setValue('digits', '1234');
      expect(validator.validate('digits')).toBe(false);
    });
    it("validate(digits) should return true in case of '12' (digits)", () => {
      validator.setValue('digits', '12');
      expect(validator.validate('digits')).toBe(true);
    });
  });

  describe("type:'custom'", () => {
    it('should pass if custom validator not passed', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'custom' },
        },
      });
      validator.setValue('digits', '1234');
      expect(validator.validate('digits')).toBe(true);
    });
    it('should pass if custom validator returns true', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'custom', validator: () => true },
        },
      });
      validator.setValue('digits', '1234');
      expect(validator.validate('digits')).toBe(true);
    });
    it('should fail if custom validator returns false', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'custom', validator: () => false },
        },
      });
      validator.setValue('digits', '1234');
      expect(validator.validate('digits')).toBe(false);
    });
  });

  describe("type:'decimals' with length", () => {
    it('should fail if length is 5 with length=4', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'decimals', length: 4 },
        },
      });
      validator.setValue('digits', '12.22');
      expect(validator.validate('digits')).toBe(false);
    });
    it('should pass if decimlas is under 4', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'decimals', negative: true },
        },
      });
      validator.setValue('digits', '-12.3');
      expect(validator.validate('digits')).toBe(true);
    });
    it('should fail if decimals are not allowed decimals=0', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'decimals', decimals: 0 },
        },
      });
      validator.setValue('digits', '12.3');
      expect(validator.validate('digits')).toBe(false);
    });
    it('should fail if decimals are not allowed decimals=0', () => {
      const validator = new Validator({
        digits: {
          validator: { type: 'decimals', negative: true, decimals: 0 },
        },
      });
      validator.setValue('digits', '-12.3');
      expect(validator.validate('digits')).toBe(false);
    });
  });

  describe('multiple validations', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        test: {
          validators: [
            { type: 'required' },
            { type: 'number', message: 'Amount should be valid' },
            { type: 'number', min: 1, message: 'Amount should be > 1' },
          ],
        },
      });
    });
    it("validate(name) should return false in case of '' (blank value)", () => {
      validator.setValue('test', '');
      expect(validator.validate('test')).toBe(false);
    });
    it('validate(name) should return required message', () => {
      validator.setValue('test', '');
      validator.validate('test');
      expect(validator.errors.test.errorMessage).toBe('This field is required');
    });
    it('validate(name) should return "Amount should be valid"', () => {
      validator.setValue('test', 'd');
      validator.validate('test');
      expect(validator.errors.test.errorMessage).toBe('Amount should be valid');
    });
  });
  describe('multiple validations', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator(
        {
          test: {
            validators: [{ type: 'required' }],
          },
          test2: {
            validators: [
              { type: 'required' },
              { type: 'number', message: 'Amount should be valid' },
              { type: 'number', min: 1, message: 'Amount should be > 1' },
            ],
          },
          test3: {
            validators: [{ type: 'abc' }],
          },
        },
        { emptyObject: false }
      );
      validator.validateAll();
    });
    it('should set error for test field', () => {
      expect(validator.errors.test.error).toBe(true);
    });
    it('should set error for test2 field', () => {
      expect(validator.errors.test2.error).toBe(true);
    });
    it('should ignore invalid validators field', () => {
      expect(validator.errors.test3).toBeUndefined();
    });
    it('should remove errors if values are valid', () => {
      validator.setValues({
        test: 'ab',
        test2: '12',
      });
      validator.validateAll();
      expect(validator.errors.test).toBeUndefined();
      expect(validator.errors.test2).toBeUndefined();
    });
  });

  describe('multiple validations with {impactOn: [] } option ', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        password: {
          impactOn: ['confirmPassword'],
          validators: [
            { type: 'required' },
            { type: 'password', message: 'Password should be valid.' },
          ],
        },
        confirmPassword: {
          validators: [
            { type: 'required' },
            {
              type: 'compareField',
              fieldName: 'password',
              message: 'Password should match.',
            },
          ],
        },
      });
    });
    it('should not call impact on field when value is not set', () => {
      validator.setValue('password', 'Abc123');
      validator.validate('password');
      expect(validator.errors.confirmPassword).toBeUndefined();
    });
    it("should not call impact on field when value is '' blank", () => {
      validator.setValue('password', 'Abc123');
      validator.setValue('confirmPassword', '');
      validator.validate('password');
      expect(validator.errors.confirmPassword).toBeUndefined();
    });
    it('should not call impact on field when value is not blank', () => {
      validator.setValue('password', 'Abc123');
      validator.setValue('confirmPassword', 'Ac');
      validator.validate('password');
      expect(validator.errors.confirmPassword.error).toBe(true);
      expect(validator.errors.confirmPassword.errorMessage).toBe(
        'Password should match.'
      );
    });
    it('should invalidate if password changes', () => {
      validator.setValue('password', 'Abc123');
      validator.setValue('confirmPassword', 'Abc123c');
      validator.validate('password');
      validator.setValue('password', 'Abc12');
      validator.validate('password');
      expect(validator.errors.confirmPassword.error).toBe(true);
      expect(validator.errors.confirmPassword.errorMessage).toBe(
        'Password should match.'
      );
    });
  });

  describe('Validator as object', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        agent: {
          validator: {
            type: 'Validator',
            validators: {
              firstName: {
                validators: [{ type: 'required' }],
              },
              lastName: {
                validators: [{ type: 'required' }],
              },
            },
          },
        },
      });
      validator.setValues({
        agent: {},
      });
      validator.validate('agent');
    });
    it('should return error as true', () => {
      expect(validator.errors.agent.error).toBe(true);
    });
    it('should return firstName required message', () => {
      expect(validator.errors.agent.errors.firstName.errorMessage).toBe(
        'This field is required'
      );
    });
    it('should return lastName required message', () => {
      expect(validator.errors.agent.errors.lastName.errorMessage).toBe(
        'This field is required'
      );
    });
  });

  describe('Validator as object', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        agent: {
          validators: {
            type: 'Validator',
            optional: true,
            validators: [
              {
                firstName: {
                  validators: [{ type: 'required' }],
                },
                phone: {
                  validators: [{ type: 'required' }, { type: 'phone' }],
                },
              },
            ],
          },
        },
        agent2: {
          validators: [
            {
              type: 'Validator',
              optional: true,
              validators: {
                firstName: {
                  validators: [{ type: 'required' }],
                },
                phone: {
                  validators: [{ type: 'required' }, { type: 'phone' }],
                },
              },
            },
          ],
        },
      });
      validator.setValues({
        agent: {
          fistName: 's',
          phone: 's',
        },
        agent2: {
          fistName: 's',
          phone: 's',
        },
      });
      validator.validateAll();
    });
    it('should return agent validation for phone if specified', () => {
      expect(validator.errors.agent2.errors.phone.errorMessage).toBe(
        'Enter a valid phone number'
      );
    });
    it('should return agent2 validation for phone if specified', () => {
      expect(validator.errors.agent2.errors.phone.errorMessage).toBe(
        'Enter a valid phone number'
      );
    });
  });

  describe('ArraValidator as object', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        choice: {
          validators: [
            {
              type: 'ArrayValidator',
              validators: {
                model: {
                  validators: [{ type: 'required' }],
                },
                preference: {
                  validators: [{ type: 'required' }],
                },
              },
            },
          ],
        },
      });
      validator.setValues({
        choice: [{ model: 'The', preference: 'Set' }, {}],
      });
      validator.validateAll();
    });
    it('should return agent validation for phone if specified', () => {
      expect(validator.errors.choice.errors['1'].model.errorMessage).toBe(
        'This field is required'
      );
    });
    it('should return agent2 validation for phone if specified', () => {
      expect(validator.errors.choice.errors['1'].preference.errorMessage).toBe(
        'This field is required'
      );
    });
  });
  describe('ArraValidator as object for blank array', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        choice: {
          validators: [
            {
              type: 'ArrayValidator',
              message: 'Required',
              validators: {
                model: {
                  validators: [{ type: 'required' }],
                },
                preference: {
                  validators: [{ type: 'required' }],
                },
              },
            },
          ],
        },
      });
      validator.setValues({
        choice: [],
      });
      validator.validateAll();
    });
    it('should return choice error=true', () => {
      expect(validator.errors.choice.error).toBe(true);
    });
    it('should return agent validation for phone if specified', () => {
      expect(validator.errors.choice.errorMessage).toBe('Required');
    });
  });
  describe('ArraValidator as object for blank array', () => {
    let validator;
    beforeEach(() => {
      validator = new Validator({
        choice: {
          validators: [
            {
              type: 'ArrayValidator',
              message: 'Required',
              validators: {
                model2: {
                  validators: [{ type: 'required' }],
                },
                preference: {
                  validators: [{ type: 'required' }],
                },
              },
            },
          ],
        },
      });
      validator.setValues({
        choice: [{ model: 'test', preference: '1' }],
      });
      validator.validateAll();
    });
    it('should return choice error=true', () => {
      expect(validator.errors.choice.error).toBe(true);
    });
    it('should return agent validation for phone if specified', () => {
      expect(validator.errors.choice.errors['0'].model2.errorMessage).toBe(
        'This field is required'
      );
    });
  });

  describe('notExists()', () => {
    it('should return false in case of 0', () => {
      expect(validators.notExists(0)).toBe(false);
    });
    it('should return true in case of blank', () => {
      expect(validators.notExists('')).toBe(true);
    });
    it('should return true in case of undefined', () => {
      expect(validators.notExists(undefined)).toBe(true);
    });
    it('should return true in case of null', () => {
      expect(validators.notExists(null)).toBe(true);
    });
  });
  describe('exists()', () => {
    it('should return false in case of 0', () => {
      expect(validators.exists(0)).toBe(true);
    });
    it('should return true in case of blank', () => {
      expect(validators.exists('23')).toBe(true);
    });
    it('should return true in case of {}', () => {
      expect(validators.exists({})).toBe(true);
    });
    it('should return true in case of [] arrya', () => {
      expect(validators.exists([])).toBe(true);
    });
  });
});
