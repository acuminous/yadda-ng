const expect = require('expect');

const { Localisation } = require('../..');
const { English } = Localisation;

describe('English', () => {
  it('should generalise statement', () => {
    expect(new English().generalise('Given A')).toBe('A');
    expect(new English().generalise('When A')).toBe('A');
    expect(new English().generalise('Then A')).toBe('A');
  });
});
