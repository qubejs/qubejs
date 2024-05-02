import { masks, addMask } from './mask';
describe('utils:format', () => {
  describe('currency()', function () {
    test('should return format default in USD', async () => {
      expect(masks.currency.mask(1)).toEqual('$1');
    });
    test('should return -$ in case ', async () => {
      expect(masks.currency.mask('-')).toEqual('$-');
    });
    test('should return -$15 in case ', async () => {
      expect(masks.currency.mask('-15')).toEqual('-$15');
    });
    test('should return -$15. in case ', async () => {
      expect(masks.currency.mask('-15.')).toEqual('-$15.');
    });
    test('should return -$15.0 in case ', async () => {
      expect(masks.currency.mask('-15.0')).toEqual('-$15.0');
    });
    test('should return -15.0 in case -$15.0 ', async () => {
      expect(masks.currency.unmask('-$15.0')).toEqual('-15.0');
    });
  });
  describe('number()', function () {
    test('should number in format', async () => {
      expect(masks.number.mask('24234324', { pattern: 'DDDDD DD' })).toEqual('24234 32');
    });
    test('should number in format', async () => {
      expect(masks.number.mask('24234324', { pattern: '(DDDDD) DD' })).toEqual('(24234) 32');
    });
    test('should return only numbers', async () => {
      expect(masks.number.unmask('(24234) 32')).toEqual('2423432');
    });
  });
  describe('phone()', function () {
    test('should return (991) 0', async () => {
      expect(masks.phone.mask(9910)).toEqual('(991) 0');
    });
    test('should return blank', async () => {
      expect(masks.phone.mask('')).toEqual('');
    });
    test('should return (991) 070', async () => {
      expect(masks.phone.mask(991070)).toEqual('(991) 070');
    });
    test('should return (991) 070 2765', async () => {
      expect(masks.phone.mask(9910702765)).toEqual('(991) 070-2765');
    });
    test('should return normal number (991) 070 2765', async () => {
      expect(masks.phone.unmask('(991) 070 2765')).toEqual('9910702765');
    });
  });
  describe('percentage()', function () {
    test('should return 12%', async () => {
      expect(masks.percentage.mask(12)).toEqual('12%');
    });
    test('should return -67%', async () => {
      expect(masks.percentage.mask(-67)).toEqual('-67%');
    });
    test('should return normal number 10', async () => {
      expect(masks.percentage.unmask('10%')).toEqual('10');
    });
  });
  describe('register new mask', function () {
    test('should return (991) 0', async () => {
      addMask('take1', {
        mask: (val) => `mask`,
        unmask: (val) => `unmask`,
      });
      expect(masks.take1.mask('9910')).toEqual('mask');
    });
  });
});
