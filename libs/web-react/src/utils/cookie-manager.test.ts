import cookieManager from './cookie-manager';

describe('utils:cookieManager', () => {
  describe('adding removing and getting cookie', function () {
    beforeEach(() => {
      document.cookie = '';
      cookieManager.add('test', 'okay');
    });
    afterEach(() => {
      cookieManager.remove('test');
    });
    test('should return okay in case test', async () => {
      expect(cookieManager.get('test')).toBe('okay');
    });
  });
  describe('cookie name might have spaces', function () {
    beforeEach(() => {
      document.cookie = '';
      cookieManager.add(' test', 'okay');
    });
    afterEach(() => {
      cookieManager.remove('test');
    });
    test('should return okay in case test', async () => {
      expect(cookieManager.get('test')).toBe('okay');
    });
  });
  describe('getAll()', function () {
    beforeEach(() => {
      document.cookie = '';
      cookieManager.add(' pike', 'same', '1h');
    });
    afterEach(() => {
      cookieManager.remove('pike');
    });
    test('should return all cookies', async () => {
      expect(cookieManager.getAll().pike).toEqual('same');
    });
  });
});
