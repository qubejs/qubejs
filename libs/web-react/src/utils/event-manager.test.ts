import EventManager from './event-manager';

describe('utils:EventManager', () => {
  describe('EventManager()', function () {
    test('should have defined', async () => {
      expect(EventManager).toBeDefined();
    });
  });
  describe('should be able to subscribe event', function () {
    let evtMgr;
    let spyFn;
    beforeEach(() => {
      evtMgr = new EventManager();
      spyFn = jest.fn(() => 2);
      evtMgr.subscribe('test.onChange', spyFn);
    });
    test('should emit() the test.onChange event', async () => {
      let result = evtMgr.emit('test.onChange', { obj: 1 }, 2);
      expect(result).toBe(2);
    });
  });
  describe('should be able to unsubscribe event', function () {
    let evtMgr;
    let spyFn;
    let spyFn2;
    beforeEach(() => {
      evtMgr = new EventManager();
      spyFn = jest.fn(() => 2);
      spyFn2 = jest.fn(() => 4);
      evtMgr.subscribe('test.onChange', spyFn);
      evtMgr.subscribe('test.onChange', spyFn2);
    });
    test('should unsubscribe specific event func', async () => {
      evtMgr.unsubscribe('test.onChange', spyFn);
      let result = evtMgr.emit('test.onChange', { obj: 1 }, 2);
      expect(result).toBe(4);
    });
    test('should emit() the test.onChange event', async () => {
      evtMgr.unsubscribe('test.onChange');
      let result = evtMgr.emit('test.onChange', { obj: 1 }, 2);
      expect(result).toBeUndefined();
    });
  });
});
