import { QueryString } from './query-string';

describe('utils:QueryString', () => {
  describe('QueryString()', function () {
    test('should have defined', async () => {
      expect(QueryString).toBeDefined();
    });
  });
  describe('toString()', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString({
        ok: 1,
        talk: 'got',
      });
    });
    test('should return string with separated', async () => {
      expect(qs.toString()).toBe('?ok=1&talk=got');
    });
  });
  describe('toObject()', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString('?pike=123&talk=more');
    });
    test('should convert to object', async () => {
      expect(qs.toObject()).toEqual({
        pike: '123',
        talk: 'more',
      });
    });
  });
});
