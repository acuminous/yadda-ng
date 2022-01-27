const expect = require('expect');
const { Gherkish } = require('../../..');
const { English } = Gherkish.Languages;

describe('English', () => {
  it('should generalise text', () => {
    expect(new English().generalise('Given A')).toBe('A');
    expect(new English().generalise('When A')).toBe('A');
    expect(new English().generalise('Then A')).toBe('A');
  });

  it('should answer to name', () => {
    expect(new English().answersToName('English')).toBe(true);
    expect(new English().answersToName('english')).toBe(true);
    expect(new English().answersToName('other')).toBe(false);
  });

  it('should have answer to code', () => {
    expect(new English().answersToCode('en')).toBe(true);
    expect(new English().answersToCode('EN')).toBe(true);
    expect(new English().answersToCode(null)).toBe(false);
    expect(new English().answersToCode(undefined)).toBe(false);
    expect(new English().answersToCode('')).toBe(false);
    expect(new English().answersToCode('other')).toBe(false);
  });
});
