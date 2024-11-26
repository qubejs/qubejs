import apiBridge from './api-bridge';
import * as utils from '.';

let fakeData = {};
utils.errorMessages.addMessages({
  LOGIN_FAILED: 'custom failed',
  K1: 'custom k1',
  K2: 'custom k2',
});

function setUpFakeData(url, data, status?, plain?) {
  if (plain) {
    fakeData[url] = {
      status: status || 200,
      data,
    };
  } else {
    fakeData[url] = {
      status: status || 200,
      data,
      json: () => {
        return data;
      },
    };
  }
}
function setUpFakeDataError(url, fn) {
  fakeData[url] = {
    fn,
  };
}

function resetFakeData() {
  fakeData = {};
}

function setUp() {
  global.fetch = jest.fn((url) => {
    if (fakeData[url].fn) {
      return fakeData[url].fn();
    }
    console.log(fakeData);
    return Promise.resolve(fakeData[url]);
  });
}

describe('Api Bridge', () => {
  beforeEach(() => {
    setUp();
  });
  test('should have get() method', () => {
    expect(typeof apiBridge.get).toBe('function');
  });
  test('should have post() method', () => {
    expect(typeof apiBridge.post).toBe('function');
  });
  test('should have update() method', () => {
    expect(typeof apiBridge.update).toBe('function');
  });
  test('should have delete() method', () => {
    expect(typeof apiBridge.delete).toBe('function');
  });
  describe('get() in success', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      setUpFakeData('/test', { status: 'success', hello: true });
      response = await apiBridge.get('/test');
    });
    test('should return the data', async () => {
      expect(response).toEqual({ status: 'success', hello: true });
    });
  });
  describe('post() in success', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      setUpFakeData('/test/post', { status: 'success', hello: true });
      response = await apiBridge.post('/test/post');
    });
    test('should return the data', async () => {
      expect(response).toEqual({ status: 'success', hello: true });
    });
  });
  describe('update() in success', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      setUpFakeData('/test/update', { status: 'success', hello: true });
      response = await apiBridge.update('/test/update');
    });
    test('should return the data', async () => {
      expect(response).toEqual({ status: 'success', hello: true });
    });
  });
  describe('patch() in success', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      setUpFakeData('/test/patch', { status: 'success', hello: true });
      response = await apiBridge.patch('/test/patch');
    });
    test('should return the data', async () => {
      expect(response).toEqual({ status: 'success', hello: true });
    });
  });
  describe('delete() in success', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      setUpFakeData('/test/delete', { status: 'success', hello: true });
      response = await apiBridge.delete('/test/delete');
    });
    test('should return the data', async () => {
      expect(response).toEqual({ status: 'success', hello: true });
    });
  });
  describe('in case of 401 error', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
    });
    test('should return the parsed response', async () => {
      setUpFakeData(
        '/login/try',
        {
          status: 'error',
          error: { error: true, errorMessage: 'login failed' },
        },
        401
      );
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        status: 'error',
        error: { error: true, errorMessage: 'login failed' },
      });
    });
    test('should return the with messsage for passed key', async () => {
      setUpFakeData(
        '/login/try',
        { status: 'error', error: { error: true, key: 'LOGIN_FAILED' } },
        401
      );
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        status: 'error',
        error: {
          error: true,
          key: 'LOGIN_FAILED',
          errorMessage: 'custom failed',
          message: 'custom failed',
        },
      });
    });
    test('should return the with all messsages for deep error structure', async () => {
      setUpFakeData(
        '/login/try',
        {
          status: 'error',
          errors: {
            g1: { error: true, key: 'K1' },
            g2: {
              errors: {
                e1: { error: true, key: 'K2' },
              },
            },
          },
          error: {
            error: true,
            key: 'LOGIN_FAILED',
            errors: {
              g1: { error: true, key: 'K1' },
              g2: {
                errors: {
                  e1: { error: true, key: 'K2' },
                },
              },
            },
          },
        },
        401
      );
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        status: 'error',
        errors: {
          g1: {
            error: true,
            errorMessage: 'custom k1',
            key: 'K1',
            message: 'custom k1',
          },
          g2: {
            errors: {
              e1: {
                error: true,
                errorMessage: 'custom k2',
                key: 'K2',
                message: 'custom k2',
              },
            },
          },
        },
        error: {
          error: true,
          key: 'LOGIN_FAILED',
          errorMessage: 'custom failed',
          message: 'custom failed',
          errors: {
            g1: {
              error: true,
              errorMessage: 'custom k1',
              key: 'K1',
              message: 'custom k1',
            },
            g2: {
              errors: {
                e1: {
                  error: true,
                  errorMessage: 'custom k2',
                  key: 'K2',
                  message: 'custom k2',
                },
              },
            },
          },
        },
      });
    });
    test('should return the as it is plain is true', async () => {
      setUpFakeData(
        '/login/try',
        {
          status: 'error',

          error: {
            error: true,
            key: 'LOGIN_FAILED',
            errors: {
              g1: { error: true, key: 'K1' },
              g2: {
                errors: {
                  e1: { error: true, key: 'K2' },
                },
              },
            },
          },
        },
        401,
        true
      );
      response = await apiBridge.delete(
        '/login/try',
        {},
        {},
        {},
        { plain: true }
      );
      expect(response).toEqual({
        data: {
          status: 'error',
          error: {
            error: true,
            key: 'LOGIN_FAILED',
            errors: {
              g1: { error: true, key: 'K1' },
              g2: {
                errors: {
                  e1: { error: true, key: 'K2' },
                },
              },
            },
          },
        },
        status: 401,
      });
    });
  });
  describe('error: 403 unauthorized', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeData(
        '/login/try',
        {
          status: 'error',
          error: { error: true, errorMessage: 'login failed' },
        },
        403
      );
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        status: 'error',
        error: { error: true, errorMessage: 'login failed' },
      });
    });
    test('should emit onUnauthroized() with response', async () => {
      const onUnauthroized = jest.fn();
      apiBridge.events.subscribe('onUnauthroized', onUnauthroized);
      setUpFakeData(
        '/login/try',
        { status: 'error', error: { error: true, key: 'LOGIN_FAILED' } },
        403
      );
      response = await apiBridge.post('/login/try');
      expect(onUnauthroized).toHaveBeenCalledTimes(1);
      expect(onUnauthroized).toHaveBeenCalledWith(fakeData['/login/try']);
    });
  });
  describe('error: 400 bad request', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeData(
        '/login/try',
        {
          status: 'error',
          error: { error: true, errorMessage: 'bad request' },
        },
        400
      );
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        status: 'error',
        error: { error: true, errorMessage: 'bad request' },
      });
    });
  });
  describe('error: 400 bad request with invalid json', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeData('/login/try', { message: 'task force' }, 502);
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        code: 502,
        error: { code: 502, message: 'task force', status: 'success' },
      });
    });
    test('should call onUnRecognizedError() if failed to compare the response', async () => {
      const onUnRecognizedError = jest.fn();
      apiBridge.events.subscribe('onUnRecognizedError', onUnRecognizedError);
      setUpFakeData('/login/try', 'talk no more', 400, true);
      response = await apiBridge.post('/login/try');
      expect(onUnRecognizedError).toHaveBeenCalledTimes(1);
      expect(onUnRecognizedError).toHaveBeenCalledWith({
        code: 400,
        error: { data: 'talk no more', status: 400 },
      });
    });
    test('should call onUnRecognizedError() if failed with different error code', async () => {
      const onUnRecognizedError = jest.fn();
      apiBridge.events.subscribe('onUnRecognizedError', onUnRecognizedError);
      setUpFakeData('/login/try', { message: 'server busy' }, 502, true);
      response = await apiBridge.post('/login/try');
      expect(onUnRecognizedError).toHaveBeenCalledTimes(1);
      expect(onUnRecognizedError).toHaveBeenCalledWith({
        code: 502,
        error: { code: 502, message: 'server busy', status: 'success' },
      });
    });
  });
  describe('error: 500 server error', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeData(
        '/login/try',
        {
          status: 'error',
          error: { error: true, errorMessage: 'server failed' },
        },
        500
      );
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        code: 500,
        status: undefined,
        error: {
          message: 'Oops something went wrong.',
          errorMessage: 'Oops something went wrong.',
          key: 'UNEXPECTED_ERROR',
        },
      });
    });
  });
  describe('error: fetch failed', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeDataError('/login/try/jsfail', () => {
        return Promise.reject({ message: 'fetch failed', stack: 'fetch failed test' });
      });
      response = await apiBridge.post('/login/try/jsfail', {});
      expect(response).toEqual({
        status: 'error',
        error: {
          error: true,
          message: 'Oops something went wrong.',
          errorMessage: 'Oops something went wrong.',
          stack: 'fetch failed test',
          key: 'UNEXPECTED_ERROR',
        },
      });
    });
  });
  describe('error: 404 page not found', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeData('/login/try', 'page not found', 404);
      response = await apiBridge.delete('/login/try');
      expect(response).toEqual({
        code: 404,
        status: undefined,
        error: {
          message: 'Page not found',
          key: 'NOT_FOUND',
        },
      });
    });
  });

  describe('other format: success: 200 page found', function () {
    let response;
    beforeEach(async () => {
      resetFakeData();
      apiBridge.reset();
    });
    test('should return the parsed response', async () => {
      setUpFakeData('/login/test', { data: { okay: 1 } }, 200);
      response = await apiBridge.post('/login/test', {});
      expect(response).toEqual({
        code: 200,
        status: 'success',
        data: {
          data: {
            okay: 1,
          },
        },
      });
    });
  });
});
