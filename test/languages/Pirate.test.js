const expect = require('expect');

const { Languages } = require('../..');
const { Pirate } = Languages;

describe('English', () => {
  it('should generalise statement', () => {
    expect(new Pirate().generalise('Giveth A')).toBe('A');
    expect(new Pirate().generalise('Whence A')).toBe('A');
    expect(new Pirate().generalise('Thence A')).toBe('A');
  });
});
