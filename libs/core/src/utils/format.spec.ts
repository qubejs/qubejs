import { formatters, setDefaults } from './format';
import datetime from './datetime';

describe('utils::Format', function () {
  describe('#currency()', function () {
    it('should format numeric value to USD as default', () => {
      expect(formatters.currency(2000)).toBe('$2,000.00');
    });
    it('should format numeric value negative to USD as default', () => {
      expect(formatters.currency(-2000)).toBe('-$2,000.00');
    });
    it('should format string numeric value to USD as default', () => {
      expect(formatters.currency('2000')).toBe('$2,000.00');
    });
    it('should be able to override configuration', () => {
      expect(
        formatters.currency('2000', {
          decimals: 0,
        })
      ).toBe('$2,000');
    });
    it('should override sign', () => {
      expect(
        formatters.currency('200000', {
          decimals: 2,
          currency: 'USD',
        })
      ).toBe('$200,000.00');
    });
    it('should return blank in case of undefined value', () => {
      expect(
        formatters.currency(undefined, {
          decimals: 2,
          currency: 'USD',
        })
      ).toBe('');
    });
    it('should return -$ in case of - only ', () => {
      expect(
        formatters.currency('-', {
          decimals: 2,
          input: true,
        })
      ).toBe('$-');
    });
    it('should return dot (.) in case of input = true ', () => {
      expect(
        formatters.currency('24.', {
          decimals: 2,
          input: true,
        })
      ).toBe('$24.');
    });
    it('should return 1 decimal case of input = true ', () => {
      expect(
        formatters.currency('24.3', {
          decimals: 2,
          input: true,
        })
      ).toBe('$24.3');
    });

    it('should return 2 decimal case of input = true ', () => {
      expect(
        formatters.currency('24.3467', {
          decimals: 2,
          input: true,
        })
      ).toBe('$24.35');
    });
  });

  describe('#currencyAbr()', function () {
    it('should return 3 digit $2,000.00', () => {
      expect(formatters.currencyAbr(2000)).toBe('$2,000.00');
    });
    it('should format as $2 mn', () => {
      expect(formatters.currencyAbr('2000000')).toBe('$2 mn');
    });
    it('should return $10 mn', () => {
      expect(formatters.currencyAbr('10000000')).toBe('$10 mn');
    });
    it('should return 10 cr', () => {
      expect(
        formatters.currencyAbr('100000000', {
          decimals: 2,
          currency: 'USD',
        })
      ).toBe('$100 mn');
    });
    it('should return blank in case of undefined value', () => {
      expect(formatters.currencyAbr()).toBe('');
    });
    it('should return Rs.3,12,000.00 ', () => {
      expect(
        formatters.currencyAbr(312000, {
          decimals: 2,
          setName: 'crabove',
          currency: 'INR',
        })
      ).toBe('₹3,12,000.00');
    });
    it('should return $3.12 mn', () => {
      expect(
        formatters.currencyAbr(3120000, {
          decimals: 2,
        })
      ).toBe('$3.12 mn');
    });
    it('should return -$3.12 mn', () => {
      expect(
        formatters.currencyAbr(-3120000, {
          decimals: 2,
        })
      ).toBe('-$3.12 mn');
    });
  });

  describe('#date()', function () {
    beforeEach(() => {
      jest
        .spyOn(datetime, 'new')
        .mockImplementation(() => new datetime.DateTime('01-01-2002'));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('should call date.toString() method', () => {
      expect(formatters.date(new Date())).toBe('Jan 01, 2002');
    });
  });
  describe('#strFix()', function () {
    it('should postfix given value', () => {
      expect(formatters.strFix('20')).toBe('20');
    });
    it('should postfix given value', () => {
      expect(formatters.strFix('20', { postfix: '/-' })).toBe('20/-');
    });
    it('should prefix given value', () => {
      expect(formatters.strFix('10', { prefix: '$' })).toBe('$10');
    });
    it('should handled undefined value', () => {
      expect(formatters.strFix(undefined, { prefix: '$' })).toBe('$');
    });
  });
  describe('#percentage()', function () {
    it('should return value with default % sign', () => {
      expect(formatters.percentage('20')).toBe('20.00%');
    });
    it('should be able to override default sign', () => {
      expect(formatters.percentage('20', { sign: '$%' })).toBe('20.00$%');
    });
    it('should be able to override default sign', () => {
      expect(formatters.percentage('20', { sign: '$%', fixed: 0 })).toBe(
        '20$%'
      );
    });
  });
  describe('#keyValue()', function () {
    it('should return blank if there is no config', () => {
      expect(formatters.keyValue('INPROGRESS')).toBe('');
    });
    it('should return for the given key', () => {
      expect(
        formatters.keyValue('INPROGRESS', {
          options: { INPROGRESS: 'In Progress' },
        })
      ).toBe('In Progress');
    });
    it('should return blank if key is not matching', () => {
      expect(
        formatters.keyValue('INPROGRESS2', {
          options: { INPROGRESS: 'In Progress' },
        })
      ).toBe('');
    });
    it('should return defaultValue if key is not matching and given default value', () => {
      expect(formatters.keyValue('INPROGRESS2', { defaultValue: 'N/A' })).toBe(
        'N/A'
      );
    });
    it('should be able to pass options as function', () => {
      expect(
        formatters.keyValue('INPROGRESS', {
          options: () => ({ INPROGRESS: 'In Progress' }),
        })
      ).toBe('In Progress');
    });
    it('should return defaultValue if key is not matching and given default value', () => {
      expect(
        formatters.keyValue('INPROGRESS2', {
          defaultValue: 'N/A',
          options: () => ({ INPROGRESS: 'In Progress' }),
        })
      ).toBe('N/A');
    });
  });
});
