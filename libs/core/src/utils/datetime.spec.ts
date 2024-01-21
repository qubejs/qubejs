import * as utils from './index';

function mock1MonthBefore() {
  return new Date(2019, 5, 25);
}
function mockToday() {
  return new Date(2019, 6, 25, 0, 0, 0);
}
function mockTomorrow() {
  return new Date(2019, 6, 26);
}
function mockNow() {
  return new Date(2019, 6, 25, 12, 30);
}

describe('utils::DateTime', function () {
  beforeAll(() => {
    jest.spyOn(utils.datetime, 'now').mockImplementation(function () {
      return new utils.datetime.DateTime(mockNow());
    });
    jest.spyOn(utils.datetime, 'today').mockImplementation(function () {
      return new utils.datetime.DateTime(mockToday());
    });
  });
  afterAll(function () {
    jest.restoreAllMocks();
  });

  describe('#now()', function () {
    it('should create date object', () => {
      expect(utils.datetime.now()).toBeDefined();
    });
    it('should have today date', () => {
      expect(utils.datetime.now()._date._d.toString()).toBe(
        mockNow().toString()
      );
    });
  });
  it('#new() should return dateobject with current datetime', () => {
    const date = utils.datetime.new();
    expect(date.toISO()).toBeDefined();
  });
  describe('#today()', function () {
    it('should create date object', () => {
      expect(utils.datetime.today()).toBeDefined();
    });
    it('should have today date', () => {
      expect(utils.datetime.today()._date._d.toString()).toBe(
        mockToday().toString()
      );
    });
  });
  describe('#DateTime', function () {
    it('should be able to create new object', () => {
      expect(new utils.datetime.DateTime(mockNow())).toBeDefined();
    });
    it('#date() should return date object', () => {
      const date = new utils.datetime.DateTime(mockNow());
      expect(date.date()).toBe(date._date._d);
    });
    it('#today() should reset the time to start', () => {
      const date = new utils.datetime.DateTime(mockNow());
      date.today();
      expect(date.date().toString()).toBe(mockToday().toString());
    });
    it('#diffInDays() should return difference in days', () => {
      const date = new utils.datetime.DateTime(mockToday());
      var date2 = new utils.datetime.DateTime(mockTomorrow());
      expect(date2.diffInDays(date)).toBe(1);
    });
    it('#diffInDays() should return -ve difference in days', () => {
      const date = new utils.datetime.DateTime(mockToday());
      var date2 = new utils.datetime.DateTime(mockTomorrow());
      expect(date.diffInDays(date2)).toBe(-1);
    });
    it('#diffInHours() should return difference in hours', () => {
      const date = new utils.datetime.DateTime(mockToday());
      var date2 = new utils.datetime.DateTime(mockNow());
      expect(date2.diffInHours(date)).toBe(12);
    });
    it('#diffInHours() should return -ve difference in days', () => {
      const date = new utils.datetime.DateTime(mockToday());
      var date2 = new utils.datetime.DateTime(mockTomorrow());
      expect(date.diffInHours(date2)).toBe(-24);
    });
    it('#addDays() should add given days', () => {
      const date = new utils.datetime.DateTime(mockToday());
      date.addDays(1);
      var date2 = new utils.datetime.DateTime(mockTomorrow());
      expect(date.diffInHours(date2)).toBe(0);
    });
    it('#endOfDay() should set time 23:59:59', () => {
      const date = new utils.datetime.DateTime(mockToday());
      expect(date.endOfDay().toString('time24')).toBe('23:59:59');
    });
    // it('#toString() should return default format', () => {
    //   const date = new utils.datetime.DateTime(mockToday());
    //   expect(date.toString()).toBe(mockToday().toISOString());
    // });
    it('#toString("short") should return with given format', () => {
      const date = new utils.datetime.DateTime(mockToday());
      expect(date.toString('short')).toBe('25th Jul, 2019');
    });
    it('#getMiliseconds() should return date in ms format', () => {
      const date = new utils.datetime.DateTime(mockToday());
      expect(date.getMiliseconds()).toBe(mockToday().getTime());
    });
    it('#startOf("day") should set time 12:00am', () => {
      const date = new utils.datetime.DateTime().startOf('day');
      expect(date.toString('hh:mm')).toBe('12:00');
    });
    it('#startOfDay() should set time 12:00am', () => {
      const date = new utils.datetime.DateTime().startOfDay();
      expect(date.toString('hh:mm')).toBe('12:00');
    });
    it('#year() should return 2019', () => {
      const date = new utils.datetime.DateTime(mockToday());
      expect(date.year()).toBe('2019');
    });
    it('#month() should return 7', () => {
      const date = new utils.datetime.DateTime(mockToday());
      expect(date.month()).toBe('7');
    });
    it('#toISO() should return iso formatted string', () => {
      const date = new utils.datetime.DateTime(mockToday());
      expect(date.toISO()).toBe(mockToday().toISOString());
    });
    it('should be able to pass datetime object', () => {
      var stDate = new utils.datetime.DateTime(mockToday());
      const date = new utils.datetime.DateTime(stDate);
      date.addDays(-1);
      expect(date.toString('short')).toBe('24th Jul, 2019');
      expect(stDate.toString('short')).toBe('25th Jul, 2019');
    });

    it('#endOf("day") should set time 11:59pm', () => {
      const date = new utils.datetime.DateTime().endOf('day');
      expect(date.toString('hh:mm')).toBe('11:59');
    });

    it('#addMonths(1) should add 1 month to date', () => {
      const date = new utils.datetime.DateTime(mockToday()).addMonths(1);
      expect(date.toString('MMM')).toBe('Aug');
    });
    it('#addMonths(-1) should add -1 month to date', () => {
      const date = new utils.datetime.DateTime(mockToday()).addMonths(-1);
      expect(date.toString('MMM')).toBe('Jun');
    });

    it('#diffInMonths(otherDate) should return 1 month', () => {
      const date = new utils.datetime.DateTime(mockToday());
      var date2 = new utils.datetime.DateTime(mock1MonthBefore());

      expect(date.diffInMonths(date2)).toBe(1);
    });
    it('#diffInSeconds(otherDate) should return 10 secs', () => {
      const date = new utils.datetime.DateTime(
        new Date('Wed Jul 08 2020 14:11:41 GMT+0530 (India Standard Time)')
      );
      var date2 = new utils.datetime.DateTime(
        new Date('Wed Jul 08 2020 14:11:31 GMT+0530 (India Standard Time)')
      );

      expect(date.diffInSeconds(date2)).toBe(10);
    });
    it('#diffInSeconds(otherDate) should return -10 secs', () => {
      const date = new utils.datetime.DateTime(
        new Date('Wed Jul 08 2020 14:11:31 GMT+0530 (India Standard Time)')
      );
      var date2 = new utils.datetime.DateTime(
        new Date('Wed Jul 08 2020 14:11:41 GMT+0530 (India Standard Time)')
      );

      expect(date.diffInSeconds(date2)).toBe(-10);
    });

    it('#diffInSeconds(otherDate) should return -10 secs', () => {
      const date = new utils.datetime.DateTime(
        new Date('Wed Jul 08 2020 14:11:31 GMT+0530 (India Standard Time)')
      );
      var date2 = new utils.datetime.DateTime(
        new Date('Wed Jul 08 2020 14:11:41 GMT+0530 (India Standard Time)')
      );

      expect(date.diffInSeconds(date2)).toBe(-10);
    });
  });
});
