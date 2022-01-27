const { strictEqual: eq, deepStrictEqual: deq } = require('assert');
const { Gherkish } = require('../../..');
const { English } = Gherkish.Languages;

describe('English', () => {
  it('should generalise text', () => {
    eq(new English().generalise('Given A'), 'A');
    eq(new English().generalise('When A'), 'A');
    eq(new English().generalise('Then A'), 'A');
  });

  it('should answer to name', () => {
    eq(new English().answersToName('English'), true);
    eq(new English().answersToName('english'), true);
    eq(new English().answersToName('other'), false);
  });

  it('should have answer to code', () => {
    eq(new English().answersToCode('en'), true);
    eq(new English().answersToCode('EN'), true);
    eq(new English().answersToCode(null), false);
    eq(new English().answersToCode(undefined), false);
    eq(new English().answersToCode(''), false);
    eq(new English().answersToCode('other'), false);
  });
});
