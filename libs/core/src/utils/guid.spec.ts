import * as utils from './index';

describe('utils:guid', function () {
  describe('#guid()', function () {
    it('should create new guid', () => {
      expect(typeof utils.guid()).toBe('string');
    });

    it('should create unique guid', () => {
      const arr: Array<string> = [];
      for (let count = 0; count < 100; count++) {
        const newGuid = utils.guid();
        expect(arr.indexOf(newGuid) > -1).toBe(false);
        arr.push(newGuid);
      }
    });
  });
});
