import logger from './logger';

describe('utils::logger', function () {
  beforeEach(() => {
    jest.spyOn(console, 'log');
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('#log()', function () {
    it('should enable logger by default', () => {
      logger.log('Test');
      expect(console.log).toHaveBeenCalledWith('Test');
    });
    it('should be able to turn off', () => {
      logger.off();
      logger.log('Test');
      expect(console.log).not.toHaveBeenCalled();
    });
    it('should be able to turn on/off', () => {
      logger.off();
      logger.log('Test');
      logger.log('Test');
      logger.on();
      logger.log('Test 2');
      expect(console.log).toHaveBeenCalledWith('Test 2');
    });
  });
  describe('#filter()', function () {
    it('should be able to set filter', () => {
      logger.filter('API:');
      logger.log('Call:Test');
      logger.log('API22:Test');
      logger.log('API:Test22');
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });
  describe('#clearFilter()', function () {
    it('should be able to set filter', () => {
      logger.filter('API:');
      logger.log('Call:Test');
      logger.log('API22:Test');
      logger.log('API:Test22');
      logger.clearFilter();
      logger.log('Call:Test');
      logger.log('API22:Test');
      logger.log('API:Test22');
      expect(console.log).toHaveBeenCalledTimes(4);
    });
  });
});
