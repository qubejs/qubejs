import browser from './browser';

describe('utils:browser', () => {
  describe('breakpoints', function () {
    test('should have defined', async () => {
      expect(browser.breakpoints).toBeDefined();
    });
  });
  describe('breakpoints.current() in case lg', function () {
    let result;
    beforeEach(() => {
      global.getComputedStyle = jest.fn(() => ({ content: '"lg"' }));
      result = browser.breakpoints.current();
    });
    afterEach(() => {
      delete global.getComputedStyle;
    });
    test('should be able to add module', async () => {
      expect(result).toBe('lg');
    });
  });
  describe('breakpoints.current() in case of default', function () {
    let result;
    beforeEach(() => {
      global.getComputedStyle = jest.fn(() => ({}));
      result = browser.breakpoints.current();
    });
    afterEach(() => {
      delete global.getComputedStyle;
    });
    test('should be able to add module', async () => {
      expect(result).toBe('xs');
    });
  });
  describe('breakpoints.down() in case of current=xs', function () {
    beforeEach(() => {
      global.getComputedStyle = jest.fn(() => ({ content: '"xs"' }));
    });
    afterEach(() => {
      delete global.getComputedStyle;
    });
    test('should return true in case of "xs"', async () => {
      expect(browser.breakpoints.down('xs')).toBe(true);
    });
    test('should return true in case of "md"', async () => {
      expect(browser.breakpoints.down('md')).toBe(true);
    });
    test('should return true in case of "lg"', async () => {
      expect(browser.breakpoints.down('lg')).toBe(true);
    });
  });
  describe('breakpoints.down() in case of current=xlg', function () {
    beforeEach(() => {
      global.getComputedStyle = jest.fn(() => ({ content: '"xlg"' }));
    });
    afterEach(() => {
      delete global.getComputedStyle;
    });
  
    test('should return true in case of "lg"', async () => {
      expect(browser.breakpoints.down('lg')).toBe(false);
    });
  });
  describe('breakpoints.up() in case of current=xs', function () {
    beforeEach(() => {
      global.getComputedStyle = jest.fn(() => ({ content: '"xs"' }));
    });
    afterEach(() => {
      delete global.getComputedStyle;
    });
    test('should return false in case of "xs"', async () => {
      expect(browser.breakpoints.up('xs')).toBe(true);
    });
    test('should return false in case of "md"', async () => {
      expect(browser.breakpoints.up('md')).toBe(false);
    });
    test('should return false in case of "lg"', async () => {
      expect(browser.breakpoints.up('lg')).toBe(false);
    });
  });
  describe('breakpoints.up() in case of current=xlg', function () {
    beforeEach(() => {
      global.getComputedStyle = jest.fn(() => ({ content: '"xlg"' }));
    });
    afterEach(() => {
      delete global.getComputedStyle;
    });
  
    test('should return true in case of "lg"', async () => {
      expect(browser.breakpoints.up('lg')).toBe(true);
    });
  });
});
