import reducer, {
  executeHook,
  customHooks,
  initApplication,
  downloadApi,
  postApi,
  clearAllUserData,
  resetLastError,
  resetUserData,
  updateUserData,
  updateProtectedUserData,
  mergeUserData,
  parseCustomModule,
  processParams,
} from './index';
import { fake } from '../../../tests/ui';
import * as utils from '../../utils';
const { apiBridge, processor } = utils;

processor.add('test', {
  getOption: (value, options) => {
    return value;
  },
  testParams: (value, options, defaultValue, state) => {
    return { value, options, defaultValue, state };
  },
  nonBlank: (value: any) => {
    return !utils.common.isNullOrUndefinedBlank(value) ? value : undefined;
  },
  nonBlankNull: (value: any) => {
    return !utils.common.isNullOrUndefinedBlank(value) ? value : null;
  },
});
describe('reducer:content', () => {
  beforeEach(() => {
    window.location.pathname = '/test';
  });
  describe('parseCustomModule()', function () {
    test('should have defined', async () => {
      expect(parseCustomModule).toBeDefined();
    });
    describe('parseCustomModule(): parsing plain string', function () {
      test('should be able to return blank params with module name', async () => {
        expect(parseCustomModule('globals.options')).toMatchObject({
          module: 'globals.options',
          params: {},
        });
      });
    });
    describe('parseCustomModule(): parsing with function params string', function () {
      test('should be able to return blank params with module name', async () => {
        expect(
          parseCustomModule(
            'globals.filterOptions(valueField: text, textField: item)'
          )
        ).toMatchObject({
          module: 'globals.filterOptions',
          params: {
            valueField: 'text',
            textField: 'item',
          },
        });
      });
    });
  });

  describe('processParams()', () => {
    test('should return hard coded data', () => {
      expect(
        processParams(
          {},
          {
            test: 'gotcha',
          }
        )
      ).toMatchObject({
        test: 'gotcha',
      });
    });
    test('should return nested data properly if not found', () => {
      const result = processParams(
        {
          app: {
            local: true,
          },
          content: {
            a: {
              b: true,
              c: {
                d: 1,
              },
            },
          },
          c: true,
          d: {
            b: true,
          },
        },
        {
          newTest: {
            k1: '.k1',
            k2: '.k2',
            k3: '.k3',
          },
          a: {
            test: {
              app1: '.gotcha',
              app2: {
                a: '.gotcha',
              },
              app3: '.d',
            },
          },
        }
      );
      expect(result).toMatchObject({
        newTest: {},
        a: {
          test: {
            app2: {},
            app3: {
              b: true,
            },
          },
        },
      });
    });
    test('should return data from userData matched key', () => {
      expect(
        processParams(
          {
            gotcha: 'value 2',
          },
          {
            test: '.gotcha',
          }
        )
      ).toMatchObject({
        test: 'value 2',
      });
    });
    test('should return data from userData matched key', () => {
      expect(
        processParams(
          {
            gotcha: 'value 2',
            user: {
              fName: 'John',
              lName: 'Cena',
              dept: 'WWE',
            },
          },
          {
            test: '.gotcha',
            nested: {
              param1: '.gold',
            },
            user: '.user',
          }
        )
      ).toMatchObject({
        test: 'value 2',
        nested: {},
        user: {
          fName: 'John',
          lName: 'Cena',
          dept: 'WWE',
        },
      });
    });
    test('should return spreded data from userData matched key', () => {
      expect(
        processParams(
          {
            newobj: {
              pace: 'pacer1',
              fName: 'Deco',
            },
            user: {
              fName: 'John',
              lName: 'Cena',
              dept: 'WWE',
            },
          },
          {
            '...user': '.user',
            '...newobj': '.newobj',
          }
        )
      ).toMatchObject({
        lName: 'Cena',
        dept: 'WWE',
        pace: 'pacer1',
        fName: 'Deco',
      });
    });
    describe('match validator', () => {
      test('should execute set result of match', () => {
        expect(
          processParams(
            {
              gotcha: 'value 2',
              user: {
                fName: 'John',
                lName: 'Cena',
                dept: 'WWE',
              },
            },
            {
              result: {
                value: {
                  match: {
                    gotcha: [
                      {
                        type: 'equals',
                        matchValue: 'value 2',
                      },
                    ],
                  },
                },
              },
            }
          )
        ).toMatchObject({
          result: {
            value: true,
          },
        });
      });
    });
    describe('custom parser', () => {
      test('should execute set result of match', () => {
        expect(
          processParams(
            {
              dynamicValue: 'dyno',
            },
            {
              result: '::test.getOption::test',
              resultWithDynamic: '::test.getOption::.dynamicValue',
            }
          )
        ).toMatchObject({
          result: 'test',
          resultWithDynamic: 'dyno',
        });
      });
      test('should pass params and options to parser function ', () => {
        expect(
          processParams(
            {
              dynamicValue: 'dyno',
              'obj.nest.timer': 12,
            },
            {
              result: '::test.testParams(p1: gold)::test',
              resultWithDynamic: '::test.testParams(p2: gold)::.dynamicValue',
              keysWithDot: '.obj.nest.timer',
            }
          )
        ).toMatchObject({
          result: {
            value: 'test',
            options: {
              p1: 'gold',
            },
          },
          keysWithDot: 12,
          resultWithDynamic: {
            value: 'dyno',
            options: {
              p2: 'gold',
            },
          },
        });
      });
      test('should override if given undefined ', () => {
        expect(
          processParams(
            {
              transaction: { a: 1, b: '' },
            },
            {
              '...tr': '.transaction',
              b: '::test.nonBlank::.transaction.b',
            }
          )
        ).toMatchObject({
          a: 1,
          b: undefined,
        });
      });
      test('should override if given null ', () => {
        expect(
          processParams(
            {
              transaction: { a: 1, b: '' },
            },
            {
              '...tr': '.transaction',
              b: '::test.nonBlankNull::.transaction.b',
            }
          )
        ).toMatchObject({
          a: 1,
          b: null,
        });
      });
    });
    describe('with undefined/null/0 value ', () => {
      test('should return except undefined & null value', () => {
        const result = processParams(
          {
            dynamicValue: 'dyno',
          },
          {
            result: undefined,
            resultWithDynamic: null,
            withNumber: 0,
          }
        );
        expect(result).toMatchObject({
          withNumber: 0,
        });
      });
    });
  });

  test('should return initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual({
      isContentLoading: false,
      pageData: {},
      metaData: {},
      protectedData: {},
      userData: { currentUrl: '/test', query: {} },
    });
  });

  describe('Reducer: updateUserData()', () => {
    test('should update data in userData', () => {
      expect(
        reducer(undefined, updateUserData({ test: { nodata: 1 } }))
      ).toEqual({
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: { currentUrl: '/test', query: {}, test: { nodata: 1 } },
      });
    });
    test('should override whole data in userData', () => {
      const prevState = {
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: { query: {}, test: { nodata: 2 } },
      };
      expect(
        reducer(prevState, updateUserData({ test: { nodata: 1 } }))
      ).toEqual({
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: { currentUrl: '/test', query: {}, test: { nodata: 1 } },
      });
    });
  });
  describe('Reducer: updateProtectedUserData()', () => {
    test('should update data in protectedData', () => {
      expect(
        reducer(undefined, updateProtectedUserData({ test: { nodata: 1 } }))
      ).toEqual({
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: { test: { nodata: 1 } },
        userData: { currentUrl: '/test', query: {}, test: { nodata: 1 } },
      });
    });
  });
  describe('Reducer: clearAllUserData()', () => {
    test('should clear data in userData and reset to initial state', () => {
      reducer(undefined, updateUserData({ test: { nodata: 1 } }));
      expect(
        reducer(undefined, clearAllUserData({ type: 'clearAll' }))
      ).toEqual({
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: { currentUrl: '/test', query: {} },
      });
    });
    test('should clear the data except protected data', () => {
      window.location.pathname = 'test';
      const lastState = reducer(
        undefined,
        updateProtectedUserData({ protect: { nodata: 1 } })
      );
      expect(
        reducer(lastState, clearAllUserData({ type: 'clearAll' }))
      ).toEqual({
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: { protect: { nodata: 1 } },
        userData: { currentUrl: '/test', protect: { nodata: 1 }, query: {} },
      });
    });
  });

  describe('Action: mergeUserData()', () => {
    test('should append data in userData', () => {
      const prevState = {
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: { query: {}, test: { nodata: 2 } },
      };
      const { store, next, invoke } = fake.thunk.create({
        content: {
          ...prevState,
        },
      });
      const action = mergeUserData({ test: { nodata22: 1 } });
      invoke(action);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: { query: {}, test: { nodata: 2, nodata22: 1 } },
        type: 'content/updateUserData',
      });
    });
  });

  describe('Action: resetUserData()', () => {
    test('should append data in userData', () => {
      const prevState = {
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: { currentUrl: '/test', query: {}, test: { nodata: 2 } },
      };
      const { store, invoke } = fake.thunk.create({
        content: {
          ...prevState,
        },
      });
      const action = resetUserData({ type: 'clearAll' });
      invoke(action);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: 'content/clearAllUserData',
      });
    });
  });

  describe('Action: resetLastError()', () => {
    test('should append data in userData', () => {
      const prevState = {
        isContentLoading: false,
        pageData: {},
        metaData: {},
        protectedData: {},
        userData: {
          currentUrl: '/test',
          lastError: { p: { error: true, errorMessage: 'error' } },
          query: {},
          test: { nodata: 2 },
        },
      };
      const { store, invoke } = fake.thunk.create({
        content: {
          ...prevState,
        },
      });
      const action = resetLastError();
      invoke(action);
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: { lastError: {} },
        type: 'content/updateUserData',
      });
    });
  });

  describe('Action: postApi()', () => {
    describe('postApi with simple api call [success]', () => {
      let store;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ status: 'success', data: { prime: true } })
        );
        const action = postApi({
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should store response in userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { prime: true, lastError: {} },
          type: 'content/updateUserData',
        });
      });
    });

    describe('postApi with notification [success]', () => {
      let store;
      let notification;
      let result;
      beforeEach(async () => {
        notification = { notification: { message: 'Test notification' } };
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
          common: {
            notification, // need to fake it get it from the store
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ status: 'success', data: { prime: true } })
        );
        const action = postApi({
          method: 'post',
          url: 'fake/api',
          defaultResponse: { success: { notification } },
        });
        store = _store;
        result = await invoke(action);
      });
      test('should set notification notification', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: notification,
          type: 'common/setNotification',
        });
      });
      test('should return object', () => {
        expect(result).toEqual({
          notification: { notification: { message: 'Test notification' } },
          status: 'success',
          data: { prime: true },
        });
      });
    });

    describe('postApi with defaultResponse array', () => {
      let store;
      let notification;
      let notification2;
      beforeEach(async () => {
        notification = { notification: { message: 'Test notification' } };
        notification2 = { notification: { message: 'Test notification 2' } };
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, userType: 'T2', test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
          common: {
            notification: notification2, // need to fake it get it from the store
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ status: 'success', data: { prime: true } })
        );
        const action = postApi({
          method: 'post',
          url: 'fake/api',
          defaultResponse: {
            success: [
              {
                notification,
                match: {
                  userType: {
                    validators: [{ type: 'equals', matchValue: 'T1' }],
                  },
                },
              },
              {
                notification: notification2,
                match: {
                  userType: {
                    validators: [{ type: 'equals', matchValue: 'T2' }],
                  },
                },
              },
            ],
          },
        });
        store = _store;
        invoke(action);
      });
      test('should set notification2 notification', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: notification2,
          type: 'common/setNotification',
        });
      });
    });

    describe('postApi with simple api call [error] + errors', () => {
      let store;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({
            status: 'error',
            error: {
              test: {
                error: true,
                errorMessage: 'cont error',
                errors: {
                  field1: { error: true, errorMessage: 'internal error' },
                },
              },
            },
          })
        );
        const action = postApi({
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should store error in lastError object in userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            test_errors: {
              field1: { error: true, errorMessage: 'internal error' },
            },
            lastError: {},
          },
          type: 'content/updateUserData',
        });
      });
    });

    describe('postApi with match [failed]', () => {
      let store;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, done: 'ok', test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ status: 'success', data: { prime: true } })
        );
        const action = postApi({
          match: {
            test: {
              validator: {
                type: 'equals',
                matchValue: 'none',
              },
            },
          },
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should store response in userData', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('postApi with preCall and postCall', () => {
      let store;
      let postHook;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: {
            query: {},
            f1: 'ok',
            f2: 'ok2',
            done: 'ok',
            test: { nodata: 2 },
          },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ status: 'success', data: { prime: true } })
        );
        const action = postApi({
          match: {
            done: {
              validator: {
                type: 'equals',
                matchValue: 'ok',
              },
            },
          },
          preCall: {
            test: '.done',
            test2: '.test.nodata',
          },
          postCall: {
            p2: '.f1',
            p3: '.f2',
          },
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should store response in userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { prime: true, lastError: {} },
          type: 'content/updateUserData',
        });
      });
      test('should call updateUserData on preCall', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            query: {},
            f1: 'ok',
            f2: 'ok2',
            done: 'ok',
            test: 'ok',
            test2: 2,
          },
          type: 'content/updateUserData',
        });
      });
      test('should updateUserData on postCall', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            query: {},
            f1: 'ok',
            f2: 'ok2',
            done: 'ok',
            test: { nodata: 2 },
            p2: 'ok',
            p3: 'ok2',
          },
          type: 'content/updateUserData',
        });
      });
    });

    describe('postApi with hooks', () => {
      let store;
      let postHook;
      let preHook;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {} },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        postHook = jest.fn();
        preHook = jest.fn();
        customHooks.add('test', {
          hook: preHook,
          hook2: postHook,
        });
        const action = postApi({
          preHook: 'test.hook',
          postHook: 'test.hook2',
        });
        store = _store;
        invoke(action);
      });
      test('should call preHook', () => {
        expect(preHook).toHaveBeenCalled();
      });
      test('should call postHook', () => {
        expect(postHook).toHaveBeenCalled();
      });
    });
  });

  describe('Action: downloadApi()', () => {
    describe('downloadApi with simple api call [success]', () => {
      let store;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ blob: () => 'success' })
        );
        const action = downloadApi({
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should store response in userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { lastError: {} },
          type: 'content/updateUserData',
        });
      });
    });

    describe('downloadApi with match [failed]', () => {
      let store;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, done: 'ok', test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ blob: () => 'success' })
        );
        const action = downloadApi({
          match: {
            test: {
              validator: {
                type: 'equals',
                matchValue: 'none',
              },
            },
          },
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should store response in userData', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
    describe('downloadApi with preCall and postCall', () => {
      let store;
      let postHook;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: {
            query: {},
            f1: 'ok',
            f2: 'ok2',
            done: 'ok',
            test: { nodata: 2 },
          },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({ blob: () => 'success' })
        );
        const action = downloadApi({
          match: {
            done: {
              validator: {
                type: 'equals',
                matchValue: 'ok',
              },
            },
          },
          preCall: {
            test: '.done',
            test2: '.test.nodata',
          },
          postCall: {
            p2: '.f1',
            p3: '.f2',
          },
          method: 'post',
          url: 'fake/api',
        });
        store = _store;
        invoke(action);
      });
      test('should call updateUserData on preCall', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            query: {},
            f1: 'ok',
            f2: 'ok2',
            done: 'ok',
            test: 'ok',
            test2: 2,
          },
          type: 'content/updateUserData',
        });
      });
      test('should updateUserData on postCall', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            query: {},
            f1: 'ok',
            f2: 'ok2',
            done: 'ok',
            test: { nodata: 2 },
            p2: 'ok',
            p3: 'ok2',
          },
          type: 'content/updateUserData',
        });
      });
    });
    describe('downloadApi with hooks', () => {
      let store;
      let postHook;
      let preHook;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {} },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        postHook = jest.fn();
        preHook = jest.fn();
        customHooks.add('test', {
          hook: preHook,
          hook2: postHook,
        });
        const action = downloadApi({
          preHook: 'test.hook',
          postHook: 'test.hook2',
        });
        store = _store;
        invoke(action);
      });
      test('should call preHook', () => {
        expect(preHook).toHaveBeenCalled();
      });
      test('should call postHook', () => {
        expect(postHook).toHaveBeenCalled();
      });
    });
  });

  describe('Action: initApplication()', () => {
    describe('with default config', () => {
      let store;
      beforeEach(async () => {
        const { store: _store, invoke } = fake.thunk.create({
          content: {},
        });

        const action = initApplication({
          url: true,
        });
        store = _store;
        invoke(action);
      });
      test('should store data in protectedData ', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            root: {
              url: true,
            },
          },
          type: 'content/updateProtectedUserData',
        });
      });
    });
    describe('with loading config and merge', () => {
      let store;
      beforeEach(async () => {
        const prevState = {
          isContentLoading: false,
          pageData: {},
          metaData: {},
          protectedData: {},
          userData: { query: {}, test: { nodata: 2 } },
        };
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            ...prevState,
          },
        });
        apiBridge.post = jest.fn(() =>
          Promise.resolve({
            status: 'success',
            data: {
              pageData: {
                merge: {
                  test: '.coratan',
                },
                hook: {
                  load: {
                    path: 'test/d',
                    method: 'post',
                  },
                },
                test: 'mode',
              },
            },
          })
        );
        const action = initApplication({
          globals: {
            path: '/get/root',
          },
        });
        store = _store;
        invoke(action);
      });
      test('should store data in protectedData ', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            root: {
              globals: {
                path: '/get/root',
              },
              merge: {
                test: '.coratan',
              },
              hook: {
                load: {
                  path: 'test/d',
                  method: 'post',
                },
              },
              test: 'mode',
            },
          },
          type: 'content/updateProtectedUserData',
        });
      });
      test('should store merged data in mergeUserData ', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: {
            query: {},
            test: '',
          },
          type: 'content/updateUserData',
        });
      });
    });
  });

  describe('Action: executeHook()', () => {
    describe('with default config [success]', () => {
      let store;
      let hook;
      beforeEach(async () => {
        const { store: _store, invoke } = fake.thunk.create({
          content: {},
        });
        hook = jest.fn(() => ({ status: 'success', data: { tank: true } }));
        customHooks.add('auth', {
          login: hook,
        });
        const action = executeHook({
          hook: 'auth.login',
        });
        store = _store;
        invoke(action);
      });
      test('should call given hook', () => {
        expect(hook).toHaveBeenCalled();
      });
      test('should save result data at root of userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { lastError: {}, tank: true },
          type: 'content/updateUserData',
        });
      });
    });
    describe('with default config [error]', () => {
      let store;
      let hook;
      beforeEach(async () => {
        const { store: _store, invoke } = fake.thunk.create({
          content: {},
        });
        hook = jest.fn(() => ({
          status: 'error',
          error: { error: true, errorMessage: 'error' },
        }));
        customHooks.add('auth', {
          login: hook,
        });
        const action = executeHook({
          hook: 'auth.login',
        });
        store = _store;
        invoke(action);
      });
      test('should call given hook', () => {
        expect(hook).toHaveBeenCalled();
      });
      test('should save result data at root of userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { lastError: { error: true, errorMessage: 'error' } },
          type: 'content/updateUserData',
        });
      });
    });
    describe('with given result dataKey', () => {
      let store;
      let hook;
      beforeEach(async () => {
        const { store: _store, invoke } = fake.thunk.create({
          content: {},
        });
        hook = jest.fn(() => ({ status: 'success', data: { tank: true } }));
        customHooks.add('auth', {
          login: hook,
        });
        const action = executeHook({
          hook: 'auth.login',
          dataKey: 'wraper',
        });
        store = _store;
        invoke(action);
      });
      test('should save result data at root of userData', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { lastError: {}, wraper: { tank: true } },
          type: 'content/updateUserData',
        });
      });
    });
    describe('with preCall and postCall', () => {
      let store;
      let hook;
      beforeEach(async () => {
        const { store: _store, invoke } = fake.thunk.create({
          content: {
            userData: {
              t1: '1',
            },
          },
        });
        hook = jest.fn(() => ({ status: 'success', data: { tank: true } }));
        customHooks.add('auth', {
          login: hook,
        });
        const action = executeHook({
          hook: 'auth.login',
          dataKey: 'wraper',
          preCall: {
            token: '.t1',
          },
          postCall: {
            token2: '.t1',
          },
        });
        store = _store;
        invoke(action);
      });
      test('should save preCall data', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { token: '.t1' },
          type: 'content/updateUserData',
        });
      });
      test('should save postCall data', () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          payload: { token2: '.t1' },
          type: 'content/updateUserData',
        });
      });
    });
  });
});
