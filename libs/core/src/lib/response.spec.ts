import Response from './response';

describe('Response', function () {
  describe('Basics', function () {
    it('should not be null', function () {
      expect(typeof Response).toBe('function');
    });
    it('should be able to create object', function () {
      expect(new Response({})).toBeDefined();
    });
  });
  describe('success()', function () {
    it('should have status prop as "success"', function () {
      const response = new Response({}).success();
      expect(response.status).toBe('success');
    });
    it('should have property as "data"', function () {
      const data = { sample: 1 };
      const response = new Response(data).success();
      expect(response.data).toBe(data);
    });
  });
  describe('error()', function () {
    it('should have status prop as "error"', function () {
      const response = new Response({}).error();
      expect(response.status).toBe('error');
    });
    it('should have property as "data"', function () {
      const data = { error: 1 };
      const response = new Response(data).error();
      expect(response.error).toEqual(data);
    });
  });
});
