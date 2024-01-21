import QueryString from './query-string';

describe('Utils:QueryString', () => {
  describe('toString()', () => {
    it('should return params in string with ?', () => {
      expect(
        new QueryString({
          x: '1',
          y: '2',
        }).toString()
      ).toBe('?x=1&y=2');
    });
    it('should return blank string if there is no params', () => {
      expect(new QueryString({}).toString()).toBe('');
    });
  });
  describe('toObject()', () => {
    it('should convert from string to object', () => {
      expect(new QueryString('?x=1&y=2').toObject()).toEqual({
        x: '1',
        y: '2',
      });
    });
    it('should return blank object if there is no params', () => {
      expect(new QueryString({}).toObject()).toEqual({});
    });
    it('should be able to handle full url', () => {
      expect(new QueryString('http://gssg.com/?query=1233').toObject()).toEqual({
        query: '1233',
      });
    });
  });
});
