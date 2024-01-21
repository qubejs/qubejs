import mask from './mask';

describe('utils::mask', function () {
  describe('#email(string)', function () {
    it('should mask email', () => {
      expect(mask.email('navneet@gmail.com')).toBe('n****@gmail.com');
    });
    it('should mask email', () => {
      expect(mask.email('tokne@gmail.com')).toBe('t****@gmail.com');
    });
  });
  describe('#phone(string)', function () {
    it('should mask phone', () => {
      expect(mask.phone('+19910702765')).toBe('+1******2765');
    });
    it('should mask phone', () => {
      expect(mask.phone('+919910708999')).toBe('+91******8999');
    });
  });
});
