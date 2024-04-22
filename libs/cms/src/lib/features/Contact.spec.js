const { chai } = require('../../../tests/setup');
var expect = chai.expect;
var { Contact } = require('./Contact');

describe('features:Contact', function () {
  describe('basic', function () {
    it('should exists', () => {
      expect(Contact).not.to.undefined;
    });
    it('should be able to create instance', () => {
      expect(new Contact()).not.to.undefined;
    });
  });
  describe('get()', function () {
    let router;
    beforeEach(() => {
      router = { post: chai.spy() };
    });
    it('should return function to attach to express', () => {
      const contact = new Contact({
        router
      });
      contact.get()();
      expect(contact.router.post).to.called.with('/message');
    });
  });
});
