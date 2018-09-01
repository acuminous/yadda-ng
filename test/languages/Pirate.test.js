const expect = require('expect');
const { Languages } = require('../..');
const { Pirate } = Languages;

describe('Pirate', () => {
  it('should generalise statement', () => {
    expect(new Pirate().generalise('Giveth A')).toBe('A');
    expect(new Pirate().generalise('Whence A')).toBe('A');
    expect(new Pirate().generalise('Thence A')).toBe('A');
  });

  it('should answer to name', () => {
    expect(new Pirate().answersToName('Pirate')).toBe(true);
    expect(new Pirate().answersToName('pirate')).toBe(true);
    expect(new Pirate().answersToName('other')).toBe(false);
  });

  it('should have no code (they\'re more guidelines really)', () => {
    expect(new Pirate().answersToCode(null)).toBe(false);
    expect(new Pirate().answersToCode(undefined)).toBe(false);
    expect(new Pirate().answersToCode('')).toBe(false);
    expect(new Pirate().answersToCode('other')).toBe(false);
  });
});
