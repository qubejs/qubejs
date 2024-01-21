import Errors from './errors';

describe("Error", () => {

    describe('nodata()', () => {
      it('should return  "no data found" message', () => {
        expect(Errors.nodata()).toEqual({
          code: 400,
          message: 'no data found',
          key: 'NO_DATA'
        });
      });
    });
    describe('invalidcred() throws error', () => {
      it('should return "username/password did not match" message', () => {
        expect(Errors.invalidcred()).toEqual({
          code: 401,
          message: 'username/password did not match',
          key: 'INVALID_CREDENTIALS'
        });
      });
    });
    describe('duprecord() throws error', () => {
      it('should return "record already exists" message', () => {
        expect(Errors.duprecord()).toEqual({
          code: 400,
          message: 'record already exists',
          key: 'DUPLICATE_RECORD'
        });
      });
    });
    describe('dbfailed() throws error', () => {
      it('should return "db operation failed" message', () => {
        expect(Errors.dbfailed()).toEqual({
          code: 400,
          message: 'db operation failed',
          key: 'DB_FAILED'
        });
      });
    });
  });
  