const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Converters } = require('../..');

describe('UpperCaseConverter', () => {
  it('should convert a string to a float', async () => {
    const converted = await new Converters.UpperCaseConverter().convert({}, 'a');
    eq(converted, 'A');
  });
});
