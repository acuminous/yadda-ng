const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Converters } = require('../..');

describe('LowerCaseConverter', () => {
  it('should convert a string to a float', async () => {
    const converted = await new Converters.LowerCaseConverter().convert({}, 'A');
    eq(converted, 'a');
  });
});
