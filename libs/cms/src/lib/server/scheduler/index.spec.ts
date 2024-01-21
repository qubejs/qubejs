import Scheduler from './index';

describe('Scheduler', function () {
  it('should exists', () => {
    expect(Scheduler).toBeDefined();
  });
  it('should be able to create instnace', () => {
    expect(new Scheduler()).toBeDefined();
  });
  describe('schedule()', () => {
    let inst, initalied, params;
    beforeAll(() => {
      function fakeLib(_params) {
        params = _params;
        return {
          init: function () {
            initalied = true;
          },
        };
      }
      inst = new Scheduler({
        interval: fakeLib,
        jobs: {
          '/test': {
            type: 'interval',
            run: function () {},
          },
        },
      });
      inst.schedule();
    });

    it('should call init', () => {
      expect(initalied).toBe(true);
    });
    it('should have name', () => {
      expect(params.name).toBe('/test');
    });
    it('should have type', () => {
      expect(params.type).toBe('interval');
    });
  });
});
