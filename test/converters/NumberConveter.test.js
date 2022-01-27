const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Converters } = require('../..');

describe('NumberConverter', () => {
  it('should convert a string to a float', async () => {
    const converted = await new Converters.NumberConverter().convert({}, '1');
    eq(converted, 1);
  });

  it('should convert a string to a float', async () => {
    const converted = await new Converters.NumberConverter().convert({}, '1.1');
    eq(converted, 1.1);
  });

  it('should convert a bogus string to NaN', async () => {
    const converted = await new Converters.NumberConverter().convert({}, 'meh');
    eq(converted, NaN);
  });
});
