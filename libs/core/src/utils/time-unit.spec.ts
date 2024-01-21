import Timeunit from './time-unit';
const timeunit = new Timeunit();

describe('Utils:timeunit', () => {
  describe('getTimeunit()', () => {
    it('should return 1s to 1000', () => {
      expect(timeunit.getTimeunit('1s')).toBe(1000);
    });
    it('should return 1m to 60000', () => {
      expect(timeunit.getTimeunit('1m')).toBe(60000);
    });
    it('should return 1h to 60 * 60 * 1000', () => {
      expect(timeunit.getTimeunit('1h')).toBe(60 * 60 * 1000);
    });
    it('should return 1d to 24 * 60 * 60 * 1000', () => {
      expect(timeunit.getTimeunit('1d')).toBe(24 * 60 * 60 * 1000);
    });
  });
});
