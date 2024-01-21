import { ValidatorCast } from './validator-cast';

describe('ValidatorCast', () => {
  it('should be defined', () => {
    expect(ValidatorCast).not.toBeUndefined();
  });
  it('should be able to create object', () => {
    expect(new ValidatorCast()).not.toBeUndefined();
  });

  describe('ValidatorCast:Basic without configuration', () => {
    let validator;
    beforeEach(() => {
      validator = new ValidatorCast();
    });
    it('cast(config) with mobile no. should return "phone"', () => {
      expect(
        validator.cast(
          {
            email: {
              value: 'email'
            },
            internationalphone: {
              value: 'phone'
            }
          },
          '+919910702765'
        )
      ).toBe('phone');
    });

    it('cast(config) with mobile no. should return "email"', () => {
      expect(
        validator.cast(
          {
            email: {
              value: 'email'
            },
            internationalphone: {
              value: 'phone'
            }
          },
          'navneetabh@gmail.com'
        )
      ).toBe('email');
    });
    it('cast(config) with invalid should return ""', () => {
      expect(
        validator.cast(
          {
            email: {
              value: 'email'
            },
            internationalphone: {
              value: 'phone'
            }
          },
          'navneetagmail.com'
        )
      ).toBe('');
    });
  });
});
