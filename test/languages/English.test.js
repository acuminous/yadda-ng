const expect = require('expect');

const { Languages } = require('../..');
const { English } = Languages;

describe('English', () => {
  it('should generalise statement', () => {
    expect(new English().generalise('Given A')).toBe('A');
    expect(new English().generalise('When A')).toBe('A');
    expect(new English().generalise('Then A')).toBe('A');
  });
});
