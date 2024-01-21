import Interval from './interval';

describe('scheduler:Interval', function () {
  it('should exists', () => {
    expect(Interval).toBeDefined();
  });
  it('should be able to create instnace', () => {
    expect(new Interval()).toBeDefined();
  });

  describe('init()', () => {
    let inst,
      result = '';
    beforeAll(() => {
      inst = new Interval({
        scheduler: { log: () => {} },
        run: () => {
          result = 'run';
        },
        frequency: '1h',
      });
      jest.spyOn(inst.options, 'run');
      inst.init();
    });

    it('should return not call run once', () => {
      expect(inst.options.run).not.toHaveBeenCalledTimes(1);
    });
  });
  describe('init() with .runAtStart = true', () => {
    let inst,
      result = '';
    beforeAll(() => {
      inst = new Interval({
        scheduler: { log: () => {} },
        run: () => {},
        frequency: '1h',
        runAtStart: true,
      });
      jest.spyOn(inst.options, 'run');
      inst.init();
    });

    it('should call run once', () => {
      expect(inst.options.run).toHaveBeenCalledTimes(1);
    });
  });
});
