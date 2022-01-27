const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { Pirate } = Gherkish.Languages;

describe('Pirate', () => {
  it('should generalise text', () => {
    eq(new Pirate().generalise('Giveth A'), 'A');
    eq(new Pirate().generalise('Whence A'), 'A');
    eq(new Pirate().generalise('Thence A'), 'A');
  });

  it('should answer to name', () => {
    eq(new Pirate().answersToName('Pirate'), true);
    eq(new Pirate().answersToName('pirate'), true);
    eq(new Pirate().answersToName('other'), false);
  });

  it("should have no code (they're more guidelines really)", () => {
    eq(new Pirate().answersToCode(null), false);
    eq(new Pirate().answersToCode(undefined), false);
    eq(new Pirate().answersToCode(''), false);
    eq(new Pirate().answersToCode('other'), false);
  });
});
