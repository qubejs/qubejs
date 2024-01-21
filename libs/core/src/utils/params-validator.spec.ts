import { ParamsValidator } from './params-validator';

describe('params:ParamValidator', function () {
  describe('#ParamValidator', function () {
    describe('checking validators required params', function () {
      let result;

      beforeEach(() => {
        result = new ParamsValidator({
          originalUrl: '/user/info',
          method: 'POST',
          body: {
            categoryName: 'Test',
          },
          url: '/user/info',
          rules: {
            '/user/info': {
              POST: {
                params: {
                  required: ['categoryName', 'uid'],
                },
              },
            },
          },
        }).validate();
      });
      it('should have uid error as true', () => {
        expect(result.uid.error).toBe(true);
      });
      it('should have uid errorMessage ', () => {
        expect(result.uid.errorMessage).toBe('Parameter required');
      });
    });

    describe('checking validators optional params', function () {
      let result;

      beforeEach(() => {
        result = new ParamsValidator({
          originalUrl: '/user/info',
          method: 'POST',
          body: {
            categoryName: 'Test',
            gold: '',
            test: 'test',
          },
          url: '/user/info',
          rules: {
            '/user/info': {
              POST: {
                params: {
                  required: ['categoryName', 'uid'],
                  optional: ['gold', 'test'],
                },
              },
            },
          },
        }).validate();
      });

      it('should not have gold errorMessage ', () => {
        expect(result.gold).toBeUndefined();
      });
      it('should not have gold errorMessage ', () => {
        expect(result.test).toBeUndefined();
      });
    });

    describe('checking validators unknown params', function () {
      let result;

      beforeEach(() => {
        result = new ParamsValidator({
          originalUrl: '/user/info',
          method: 'POST',
          body: {
            categoryName: 'Test',
            gold2: '',
            test2: 'test',
          },
          url: '/user/info',
          rules: {
            '/user/info': {
              POST: {
                params: {
                  required: ['categoryName', 'uid'],
                  optional: ['gold', 'test'],
                },
              },
            },
          },
        }).validate();
      });

      it('should have gold2 error as true ', () => {
        expect(result.gold2.error).toBe(true);
      });
      it('should have gold2 errorMessage ', () => {
        expect(result.gold2.errorMessage).toBe('Unknown parameter');
      });
      it('should have test2 errorMessage ', () => {
        expect(result.test2.errorMessage).toBe('Unknown parameter');
      });
    });

    describe('checking validators unknown params exists in validatory', function () {
      let result;

      beforeEach(() => {
        result = new ParamsValidator({
          originalUrl: '/user/info',
          method: 'POST',
          body: {
            categoryName: 'Test',
            uid: 'test1',
            gold2: 'gg',
            test: '',
          },
          url: '/user/info',
          rules: {
            '/user/info': {
              POST: {
                params: {
                  required: ['categoryName', 'uid'],
                  optional: ['gold', 'test'],
                },
                validators: {
                  gold2: {
                    type: 'required',
                  },
                },
              },
            },
          },
        }).validate();
      });

      it('should not have gold2 error', () => {
        expect(result.gold2).toBeUndefined();
      });
    });

    describe('checking validators fail scenario', function () {
      let result;

      beforeEach(() => {
        result = new ParamsValidator({
          originalUrl: '/user/info',
          method: 'POST',
          body: {},
          url: '/user/info',
          rules: {
            '/user/info': {
              POST: {
                validators: {
                  categoryName: {
                    validators: [
                      {
                        type: 'required',
                      },
                    ],
                  },
                },
              },
            },
          },
        }).validate();
      });
      it('should have categoryName error as true', () => {
        expect(result.categoryName.error).toBe(true);
      });
      it('should have categoryName errorMessage ', () => {
        expect(result.categoryName.errorMessage).toBe('This field is required');
      });
    });

    describe('checking validators fail scenario', function () {
      let result;

      beforeEach(() => {
        result = new ParamsValidator({
          originalUrl: '/user/info',
          method: 'POST',
          body: {
            categoryName: 'Hell0',
          },
          url: '/user/info',
          rules: {
            '/user/info': {
              POST: {
                validators: {
                  categoryName: {
                    validators: [
                      {
                        type: 'required',
                      },
                    ],
                  },
                },
              },
            },
          },
        }).validate();
      });
      it('should not have categoryName', () => {
        expect(result.categoryName).toBeUndefined();
      });
    });
  });
});
