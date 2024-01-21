import DataTypes from './data-types';


describe("DataTypes", () => {
  describe("DataTypes:string()", function () {

   test('should convert from number to string', () => {
      const stringMapper = DataTypes.string("");
      expect(stringMapper(12)).toBe("12");
    });
   test('should convert from object to string', () => {
      const stringMapper = DataTypes.string("")
      expect(stringMapper({key:1})).toBe('[object Object]');
    });
  });
  describe("DataTypes:number()", function () {

   test('should convert from string to number', () => {
      const numMapper = DataTypes.number();
      expect(numMapper('12')).toBe(12);
    });
   test('should convert from number to number', () => {
      const numMapper = DataTypes.number()
      expect(numMapper()).toBe(undefined);
    });
   test('should convert from object to number', () => {
      const numMapper = DataTypes.number()
      expect(numMapper({})).toBe(undefined);
    });
  });
  describe("DataTypes:any()", function () {

   test('should return as it is', () => {
      const anyMapper = DataTypes.any();
      expect(anyMapper('12')).toBe('12');
    });
   test('should return undefined', () => {
      const anyMapper = DataTypes.any()
      expect(anyMapper()).toBe(undefined);
    });
   test('should return empty object', () => {
      const anyMapper = DataTypes.any()
      expect(anyMapper({})).toEqual({});
    });
   test('should return undefined value', () => {
      const anyMapper = DataTypes.any()
      expect(anyMapper(null)).toEqual(undefined);
    });
  });
  describe("DataTypes:object()", function () {

   test('should return with given object', () => {
      const objectMapper = DataTypes.object();
      expect(objectMapper({})).toEqual({});
    });
   test('should return undefined', () => {
      const objectMapper = DataTypes.object()
      expect(objectMapper()).toBe(undefined);
    });
   test('should return default date given', () => {
      const objectMapper = DataTypes.object({'default':1})
      expect(objectMapper()).toEqual({'default':1});
    });
   test('should return undefined value', () => {
      const objectMapper = DataTypes.object()
      expect(objectMapper(null)).toEqual(null);
    });
  });
  describe("DataTypes:array()", function () {

   test('should return with given array', () => {
      const arrayMapper = DataTypes.array();
      expect(arrayMapper([])).toEqual([]);
    });
   test('should return undefined', () => {
      const arrayMapper = DataTypes.array()
      expect(arrayMapper()).toBe(undefined);
    });
   test('should return default date given', () => {
      const arrayMapper = DataTypes.array(['a'])
      expect(arrayMapper()).toEqual(['a']);
    });
   test('should return undefined value', () => {
      const arrayMapper = DataTypes.array()
      expect(arrayMapper(null)).toEqual(undefined);
    });
  });
  describe("DataTypes:dateISOString()", function () {

   test('should return with date string', () => {
      const dateISOStringMapper = DataTypes.dateISOString();
      expect(dateISOStringMapper(new Date('2019-02-02'))).toBe('2019-02-02T00:00:00.000Z');
    });
   test('should return undefined', () => {
      const dateISOStringMapper = DataTypes.dateISOString()
      expect(dateISOStringMapper()).toBe(undefined);
    });
   test('should return default date given', () => {
      const dateISOStringMapper = DataTypes.dateISOString(new Date('2019-01-01'))
      expect(dateISOStringMapper()).toEqual('2019-01-01T00:00:00.000Z');
    });
   test('should return undefined value', () => {
      const dateISOStringMapper = DataTypes.dateISOString()
      expect(dateISOStringMapper(null)).toEqual(undefined);
    });
  });
});