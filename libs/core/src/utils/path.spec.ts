import path from './path';

describe('utils:path', function () {
  describe('#path.ensureSlashAtEnd(path)', function () {
    it('should return / at end of path', () => {
      expect(path.ensureSlashAtEnd('/test/content')).toBe('/test/content/');
    });
    it('should return / at end of path', () => {
      expect(path.ensureSlashAtEnd('/test/content/')).toBe('/test/content/');
    });
    it('should return / at start of path', () => {
      expect(path.ensureSlashAtStart('/test/')).toBe('/test/');
    });
    it('should return / at start of path', () => {
      expect(path.ensureSlashAtStart('test/')).toBe('/test/');
    });
  });
});
