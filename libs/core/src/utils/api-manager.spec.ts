import ApiManager from './api-manager';

describe('utils:ApiManager', function () {
  describe('basic', function () {
    it('should exists', () => {
      expect(ApiManager).toBeDefined();
    });
    it('should be able to create instance', () => {
      expect(new ApiManager()).toBeDefined();
    });
  });

  describe('get()', function () {
    let apiMgr;
    let axios: any;
    let params: any;
    beforeAll(() => {
      axios = {
        method: () => {},
      };
      jest.spyOn(axios, 'method').mockImplementation((...args: any) => {
        params = args;
        return Promise.resolve({ args });
      });

      apiMgr = new ApiManager({
        axios: axios.method,
        domain: 'http://test.com',
      });
      apiMgr.get('/test');
    });
    it('should call axios', () => {
      expect(axios.method).toBeCalled();
    });
    it('should called with given params', () => {
      expect(params[0]).toEqual({
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'get',
        url: 'http://test.com/test',
      });
    });
  });

  describe('post()', function () {
    let apiMgr;
    let axios: any;
    let params: any;
    beforeAll(() => {
      axios = {
        method: () => {},
      };
      jest.spyOn(axios, 'method').mockImplementation((...args: any) => {
        params = args;
        return Promise.resolve({ args });
      });

      apiMgr = new ApiManager({
        axios: axios.method,
        domain: 'http://test.com',
      });
      apiMgr.post('/test');
    });
    it('should call axios', () => {
      expect(axios.method).toBeCalled();
    });
    it('should called with given params', () => {
      expect(params[0]).toEqual({
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        url: 'http://test.com/test',
      });
    });
  });
  describe('put()', function () {
    let apiMgr;
    let axios: any;
    let params: any;
    beforeAll(() => {
      axios = {
        method: () => {},
      };
      jest.spyOn(axios, 'method').mockImplementation((...args: any) => {
        params = args;
        return Promise.resolve({ args });
      });

      apiMgr = new ApiManager({
        axios: axios.method,
        domain: 'http://test.com',
      });
      apiMgr.put('/test');
    });
    it('should call axios', () => {
      expect(axios.method).toBeCalled();
    });
    it('should called with given params', () => {
      expect(params[0]).toEqual({
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'put',
        url: 'http://test.com/test',
      });
    });
  });
  describe('delete()', function () {
    let apiMgr;
    let axios: any;
    let params: any;
    beforeAll(() => {
      axios = {
        method: () => {},
      };
      jest.spyOn(axios, 'method').mockImplementation((...args: any) => {
        params = args;
        return Promise.resolve({ args });
      });

      apiMgr = new ApiManager({
        axios: axios.method,
        domain: 'http://test.com',
      });
      apiMgr.delete('/test');
    });
    it('should call axios', () => {
      expect(axios.method).toBeCalled();
    });
    it('should called with given params', () => {
      expect(params[0]).toEqual({
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'delete',
        url: 'http://test.com/test',
      });
    });
  });

  describe('post() -> success()', function () {
    let apiMgr;
    let axios: any;
    let params: any;
    let response: any;
    beforeAll(async () => {
      axios = {
        method: () => {},
      };
      jest.spyOn(axios, 'method').mockImplementation((...args) => {
        params = args;
        return Promise.resolve({ args, data: { test: true }, status: 200 });
      });

      apiMgr = new ApiManager({
        axios: axios.method,
        domain: 'http://test.com',
      });
      response = await apiMgr.post('/test');
    });
    it('should call axios', () => {
      expect(axios.method).toBeCalled();
    });
    it('should called with given params', () => {
      expect(params[0]).toEqual({
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        url: 'http://test.com/test',
      });
    });
    it('should have response.data', () => {
      expect(response.data).toEqual({ test: true });
    });
    it('should have response.success', () => {
      expect(response.success).toBe(true);
    });
    it('should have response.code', () => {
      expect(response.code).toBe(200);
    });
  });

  describe('post() -> error()', function () {
    let apiMgr;
    let axios: any;
    let params: any;
    let response: any;
    beforeAll(async () => {
      axios = {
        method: () => {},
      };
      jest.spyOn(axios, 'method').mockImplementation((...args: any[]) => {
        params = args;
        return Promise.reject({
          args,
          response: { data: { error: true }, status: 400 },
        });
      });

      apiMgr = new ApiManager({
        axios: axios.method,
        domain: 'http://test.com',
      });
      await apiMgr.post('/test').catch((ex) => {
        response = ex;
      });
    });
    it('should call axios', () => {
      expect(axios.method).toBeCalled();
    });
    it('should called with given params', () => {
      expect(params[0]).toEqual({
        data: {},
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        url: 'http://test.com/test',
      });
    });
    it('should have response.data', () => {
      expect(response.data).toEqual({ error: true });
    });
    it('should have response.success', () => {
      expect(response.error).toBe(true);
    });
    it('should have response.code', () => {
      expect(response.code).toBe(400);
    });
  });
});
