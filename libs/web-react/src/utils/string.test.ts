import string from './string';

describe('utils:string', () => {
  test('should have defined', async () => {
    expect(string).toBeDefined();
  });
  test('string.getFirstChar() should return T', async () => {
    expect(string.getFirstChar('Taken for the')).toBe('T');
  });
  test('string.getFirstChar() should ignore spaces', async () => {
    expect(string.getFirstChar(' Taken for the')).toBe('T');
  });
  test('string.getFirstChar() should return blank in case of undefined', async () => {
    expect(string.getFirstChar()).toBe('');
  });
  test('string.getTwoChars() should return T', async () => {
    expect(string.getTwoChars('Taken for the')).toBe('Tf');
  });
  test('string.getTwoChars() should ignore spaces', async () => {
    expect(string.getTwoChars(' Taken for the')).toBe('Tf');
  });
  test('string.getTwoChars() should return blank in case of undefined', async () => {
    expect(string.getTwoChars()).toBe('');
  });
  test('string.titleCase(ROCK) should return Rock', async () => {
    expect(string.titleCase('ROCK')).toBe('Rock');
  });
  test('string.titleCase(rock) should return Rock', async () => {
    expect(string.titleCase('rock')).toBe('Rock');
  });
  test('string.titleCase() should return blank', async () => {
    expect(string.titleCase()).toBe('');
  });
  test('string.titleCase(null) should return blank', async () => {
    expect(string.titleCase(null)).toBe('');
  });
});
