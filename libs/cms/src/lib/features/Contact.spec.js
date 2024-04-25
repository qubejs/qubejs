var { Contact } = require('./Contact');

describe('features:Contact', function () {
  describe('basic', function () {
    it('should exists', () => {
      expect(Contact).toBeDefined()
    });
    it('should be able to create instance', () => {
      expect(new Contact()).toBeDefined()
    });
  });
  describe('get()', function () {
    let router;
    beforeEach(() => {
      router = { post: jest.fn() };
    });
    it('should return function to attach to express', () => {
      const contact = new Contact({
        router
      });
      contact.get()();
      expect(contact.router.post).toHaveBeenCalledTimes(1);
    });
  });
});
