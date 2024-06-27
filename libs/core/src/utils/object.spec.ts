import * as utils from './index';
const { object } = utils;

describe('utils:object', function () {
  describe('#object.clone(obj)', function () {
    describe('checking copy of object', function () {
      let obj1, cloneObj;

      beforeEach(() => {
        obj1 = { value: '12', nest: { value: 3 } };
        cloneObj = object.clone(obj1);
      });
      it('should return copy of object', () => {
        expect(cloneObj.value).toBe('12');
      });
      it('should not affect obj1', () => {
        cloneObj.value = '13';
        expect(obj1.value).toBe('12');
      });
      it('should check nesting objects', () => {
        cloneObj.nest.value = '13';
        expect(obj1.nest.value).toBe(3);
      });
    });
  });
  describe('#object.getDataFromKey(obj, key, default)', function () {
    it('should return ""', () => {
      expect(object.getDataFromKey({ test: '12' }, 'test2')).toBe('');
    });
    it('should return null', () => {
      expect(object.getDataFromKey({ test: '12' }, 'test2', null)).toBe(null);
    });
    it('should not throw error', () => {
      expect(
        object.getDataFromKey(
          { test: '12' },
          {
            test: 'test',
            key: {
              type: {
                obje: true,
              },
            },
          },
          null
        )
      ).toEqual({
        test: 'test',
        key: {
          type: {
            obje: true,
          },
        },
      });
    });

    it('should not return root object if not found', () => {
      expect(
        object.getDataFromKey({ test: '12', id: '1', id2: '1' }, 'id23')
      ).toBe('');
    });

    it('should return value from nested object', () => {
      expect(
        object.getDataFromKey(
          { test: '12', nest: { okay: true } },
          'nest.okay',
          ''
        )
      ).toBe(true);
    });
    it('should return value from nested object', () => {
      expect(
        object.getDataFromKey(
          { test: '12', nest: { okay: true } },
          'nest.okay.test.ter',
          ''
        )
      ).toBe('');
    });

    it('should return value', () => {
      expect(object.getDataFromKey({ test: '12' }, 'test', '')).toBe('12');
    });

    it('should return value', () => {
      expect(object.getDataFromKey({ test: '12' }, 'test', '')).toBe('12');
    });

    it('should return value blank', () => {
      expect(
        object.getDataFromKey({ app: { test: true }, test: '12' }, 'test2')
      ).toBe('');
    });
    it('should return value null', () => {
      expect(
        object.getDataFromKey(
          { app: { test: true }, test: '12' },
          'test2',
          null
        )
      ).toBe(null);
    });

    it('should return value', () => {
      expect(
        object.getDataFromKey({ app: { test: true }, test: '12' }, { a: true })
      ).toEqual({ a: true });
    });
  });

  describe('#processMessage()', function () {
    it('should convert ##field## to values', () => {
      expect(
        object.processMessage('You are an absolute ##value##.', {
          value: 'test',
        })
      ).toBe('You are an absolute test.');
    });
    it('should convert ##nested.field## to values', () => {
      expect(
        object.processMessage(
          'You are an absolute ##nest.value## ##other.test##.',
          {
            value: 'test',
            nest: { value: 'ok' },
            other: { test: 'new' },
          }
        )
      ).toBe('You are an absolute ok new.');
    });
    it('should call formatter ##currency|nested.field## to values', () => {
      expect(
        object.processMessage('You are an absolute ##currency|nest.value##.', {
          value: 'test',
          nest: { value: 2000 },
          other: { test: 'new' },
        })
      ).toBe('You are an absolute $2,000.00.');
    });
    it('should not print undefined if value is not available', () => {
      expect(
        object.processMessage(
          'You are an absolute ##data.choice1##.',
          {},
          { removePrefix: 'data.' }
        )
      ).toBe('You are an absolute .');
    });
  });
  describe('#processBlock(block, data)', function () {
    describe('simple inject dynamic data to target block at root level', () => {
      let targetObj;
      let result;
      beforeEach(() => {
        targetObj = {
          cmpType: 'Input',
          inject: {
            value: 'textValue',
          },
          nested: {
            obj: {
              inject: {
                nestInj: 'textValue2',
              },
            },
          },
        };
        result = object.processBlock(targetObj, {
          userData: { textValue: 'newValue', textValue2: 'value 2' },
        });
      });
      it('should have value as "newValue"', () => {
        expect(result.value).toBe('newValue');
      });
      it('should have target.nested.obj.nestInj as "value 2"', () => {
        expect(result.nested.obj.nestInj).toBe('value 2');
      });
    });

    it('should inject data from nested objects', () => {
      const targetObj: any = {
        component: 'Form',
        fields: {
          cmpType: 'Date',
          className: 'test',
          inject: {
            disabled: 'form.isSubmitting',
          },
        },
      };
      object.processBlock(targetObj, {
        userData: { form: { isSubmitting: true } },
      });
      expect(targetObj.fields.disabled).toBe(true);
    });

    it('should inject data in array of objects', () => {
      const targetObj: any = {
        component: 'Form',
        fields: [
          {
            cmpType: 'Date',
            className: 'test',
            inject: {
              disabled: 'isSubmitting',
            },
          },
        ],
      };
      object.processBlock(targetObj, {
        userData: { isSubmitting: false },
      });
      expect(targetObj.fields[0].disabled).toBe(false);
    });

    it('should inject validate result ', () => {
      const targetObj: any = {
        component: 'Form',
        fields: [
          {
            cmpType: 'Date',
            className: 'test',
            inject: {
              disabled: {
                match: {
                  custom: {
                    validators: [
                      {
                        type: 'or',
                        validations: [
                          {
                            type: 'equals',
                            fieldName: 'field1',
                            matchValue: true,
                          },
                          {
                            type: 'equals',
                            fieldName: 'field2',
                            matchValue: true,
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      };
      object.processBlock(targetObj, {
        userData: { field1: false, field2: true },
      });
      expect(targetObj.fields[0].disabled).toBe(true);
    });

    it('should not throw error if options and data is not passed ', () => {
      const targetObj: any = {
        component: 'Form',
        fields: [
          {
            cmpType: 'Date',
            className: 'test',
            inject: {
              disabled: {
                match: {
                  custom: {
                    validators: [
                      {
                        type: 'or',
                        validations: [
                          {
                            type: 'equals',
                            fieldName: 'field1',
                            matchValue: true,
                          },
                          {
                            type: 'equals',
                            fieldName: 'field2',
                            matchValue: true,
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
      };
      object.processBlock(targetObj);
      expect(targetObj.fields[0].disabled).toBe(false);
    });
  });

  describe('with custom processors', function () {
    it('should inject data from nested objects', () => {
      const targetObj: any = {
        component: 'Form',
        fields: {
          cmpType: 'Date',
          className: 'test',
          inject: {
            rocketTest: '::dataType.forceArray::.like',
            rocketTest2: '::dataType.forceArray::.like2',
            bigB: '.oliver',
            ram: 'ramsey',
          },
        },
      };
      object.processBlock(targetObj, {
        userData: { ramsey: 'okay', oliver: 'queen', like2: ['1'], like: '1', form: { isSubmitting: true } },
        state: { content: { rocky: 'rai' } },
      });
      expect(targetObj.fields.rocketTest).toEqual([]);
      expect(targetObj.fields.rocketTest2).toEqual(['1']);
      expect(targetObj.fields.ram).toBe('okay');
      expect(targetObj.fields.bigB).toBe('queen');
    });
  });

  describe('#extendData(block, data)', function () {
    it('should inject data from nested objects', () => {
      const defaultObj = {
        test: {
          nest: {
            obj: null,
            obj1: {
              got: true,
            },
          },
        },
      };
      const targetObj: any = {
        test: {
          nest: {
            obj1: {
              obj2: null,
              got: 1,
            },
          },
        },
      };
      const result = object.extendData(defaultObj, targetObj);
      expect(result).toEqual({
        test: {
          nest: {
            obj: null,
            obj1: {
              obj2: null,
              got: 1,
            },
          },
        },
      });
    });
  });
});
