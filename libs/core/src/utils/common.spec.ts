import commons from './common';
describe('utils:common', function () {
  describe('#isNullOrUndefined()', function () {
    it('should return true when there is null value', () => {
      expect(commons.isNullOrUndefined(null)).toBe(true);
    });
    it('should return true when there is undefined value', () => {
      expect(commons.isNullOrUndefined(undefined)).toBe(true);
    });
    it('should return false when there is blank value', () => {
      expect(commons.isNullOrUndefined('')).toBe(false);
    });
    it('should return false when there is 0 value', () => {
      expect(commons.isNullOrUndefined(0)).toBe(false);
    });
  });
  describe('#isNullOrUndefinedBlank()', function () {
    it('should return true when there is null value', () => {
      expect(commons.isNullOrUndefinedBlank(null)).toBe(true);
    });
    it('should return true when there is undefined value', () => {
      expect(commons.isNullOrUndefinedBlank(undefined)).toBe(true);
    });
    it('should return true when there is blank value', () => {
      expect(commons.isNullOrUndefinedBlank('')).toBe(true);
    });
    it('should return false when there is 0 value', () => {
      expect(commons.isNullOrUndefinedBlank(0)).toBe(false);
    });
  });
  describe('#getValue()', function () {
    it('should return null', () => {
      expect(commons.getValue(null)).toBe('');
    });
    it('should return exact value if not fn', () => {
      expect(commons.getValue({}, 'test')).toBe('test');
    });
    it('should return true when there is blank value', () => {
      expect(commons.getValue({}, (args) => 'fun result')).toBe('fun result');
    });
  });
});
