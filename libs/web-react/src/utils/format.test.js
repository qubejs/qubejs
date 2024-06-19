import { getFormatters } from './format';
import { set } from './currency';
describe("utils:format", () => {

  describe("currency()", function () {

   test('should return format default in USD', async () => {
      expect(getFormatters().currency(3000)).toEqual('$3,000');
    });
   test('should return format default in USD', async () => {
      expect(getFormatters().currency(3000)).toEqual('$3,000');
    });
   test('should return format default in INR', async () => {
      set('INR');
      expect(getFormatters().currency(300000)).toEqual('₹3,00,000');
    });
   test('should be able to override with new options', async () => {
      expect(getFormatters().currency(300000, { sign: '$', currency: 'USD', decimals: 1 })).toEqual('$300,000.0');
    });

  });

});