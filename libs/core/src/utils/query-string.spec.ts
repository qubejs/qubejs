import QueryString from './query-string';

describe('utils:QueryString', () => {
  describe('QueryString()', function () {
    test('should have defined', async () => {
      expect(QueryString).toBeDefined();
    });
  });
  describe('toString()', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString({
        ok: 1,
        talk: 'got',
      });
    });
    test('should return string with separated', async () => {
      expect(qs.toString()).toBe('?ok=1&talk=got');
    });
  });
  describe('toString() as array', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString({
        ok: 1,
        talk: ['got', 'rot', 'pot'],
      });
    });
    test('should return string with separated', async () => {
      expect(qs.toString()).toBe('?ok=1&talk=got&talk=rot&talk=pot');
    });
  });
  describe('toString() as array', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString({
        ok: 1,
        talk: ['got'],
      });
    });
    test('should return string with separated', async () => {
      expect(qs.toString()).toBe('?ok=1&talk=got');
    });
  });
  describe('toString() as object', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString({
        ok: 1,
        talk: { a: '123', b: '344' },
      });
    });
    test('should return string with separated', async () => {
      expect(qs.toString()).toBe('?ok=1&talk=o%3A%7B%22a%22%3A%22123%22%2C%22b%22%3A%22344%22%7D');
    });
  });
  describe('toObject()', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString('?pike=123&talk=more');
    });
    test('should convert to object', async () => {
      expect(qs.toObject()).toEqual({
        pike: '123',
        talk: 'more',
      });
    });
  });
  describe('toObject() should return array', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString('?pike=123&talk=more&talk=123');
    });
    test('should convert to object including talk as array', async () => {
      expect(qs.toObject()).toEqual({
        pike: '123',
        talk: ['more', '123'],
      });
    });
  });

  describe('toObject() should return o: prefixed including object', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString(
        '?pike=123&talk=o%3A%7B%22a%22%3A%22234%22%2C%22b%22%3A%22w%22%7D'
      );
    });
    test('should convert to object including talk as object', async () => {
      expect(qs.toObject()).toEqual({
        pike: '123',
        talk: { a: '234', b: 'w' },
      });
    });
  });
  describe('toObject() should return force array', function () {
    let qs;
    beforeEach(() => {
      qs = new QueryString('?pike=123&talk=o%3A%5B%22123%22%2C%22344%22%5D');
    });
    test('should convert to array including talk as array', async () => {
      expect(qs.toObject()).toEqual({
        pike: '123',
        talk: ['123', '344'],
      });
    });
  });
});
