import number from './number';

describe('utils:number', function () {
  describe('#number.getRandomNumber(max)', function () {
    it('should return random number less than 10', () => {
      expect(number.getRandomNumber(10) <= 10).toBe(true);
      expect(number.getRandomNumber(10) <= 10).toBe(true);
    });
  });
  describe('#number.getRandomMobile()', function () {
    it('should return 10 digit mobile', () => {
      expect(number.getRandomMobile().length).toBe(10);
    });
  });
  describe('#number.getRandomBetweenRange(min,max)', function () {
    it('should return number between 5 and 7', () => {
      const num = number.getRandomBetweenRange(5, 7);
      expect(num >= 5 && num <= 7).toBe(true);
    });
    it('should return number between 50 and 90', () => {
      const num = number.getRandomBetweenRange(50, 90);
      expect(num >= 50 && num <= 90).toBe(true);
    });
  });
  describe('#number.preFix(num, length)', function () {
    it('should return 01', () => {
      const num = number.preFix(1, '0', 2);
      expect(num).toBe('01');
    });

    it('should return 000013', () => {
      const num = number.preFix(13, '0', 6);
      expect(num).toBe('000013');
    });
  });
});
