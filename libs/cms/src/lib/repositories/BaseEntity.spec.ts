// import _ from 'lodash';
// import { utils } from '@qubejs/core';
// import { fakeDb } from '../../../test';
import BaseEntity from './BaseEntity';

describe('BaseEntity', () => {
  beforeEach(() => {});
  afterEach(() => {});

  describe('Basic', () => {
    it('should be defined', () => {
      const obj = new BaseEntity();
      expect(obj).toBeDefined();
    });
  });

  describe('field set', () => {
    it('should set all fields except', () => {
      const obj: any = new BaseEntity({
        _id: 'testguid',
        rocket: 1,
        league: 2,
      });
      expect(obj.rocket).toBe(1);
      expect(obj.league).toBe(2);
    });
  });

  describe('toObject should filter out excluded keys ( _doc)', () => {
    it('should set all fields except', () => {
      const obj: any = new BaseEntity({
        _id: 'testguid',
        rocket: 1,
        league: 2,
      }).toObject();
      expect(obj._doc).not.toBeDefined();
      expect(obj.excludeKeys).not.toBeDefined();
    });
  });

  describe('uid field handling', () => {
    it('should set _id as uid', () => {
      const obj = new BaseEntity({
        _id: 'testguid',
      });
      expect(obj.uid).toBe('testguid');
    });
    it('should take uid if uid is present', () => {
      const obj = new BaseEntity({
        uid: 'localuid',
        otherF: '1',
      });
      expect(obj.uid).toBe('localuid');
    });
    it('should not set _id field', () => {
      const obj: any = new BaseEntity({
        _id: 'testguid',
        uid: 'localuid',
      });
      expect(obj._id).not.toBeDefined();
    });
  });
});
