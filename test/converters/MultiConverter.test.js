const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Converters } = require('../..');

describe('MultiConverter', () => {
  it('should combine multiple converters', async () => {
    const converter1 = new Converters.LowerCaseConverter();
    const converter2 = new Converters.UpperCaseConverter();
    const multiConverter = new Converters.MultiConverter({ converters: [converter1, converter2] });
    const converted = await multiConverter.convert({}, ['A', 'b']);
    eq(converted.length, 2);
    eq(converted[0], 'a');
    eq(converted[1], 'B');
  });

  it('should report the argument demand', async () => {
    const converter1 = new Converters.LowerCaseConverter();
    const converter2 = new Converters.UpperCaseConverter();
    const multiConverter = new Converters.MultiConverter({ converters: [converter1, converter2] });
    eq(multiConverter.demand, 2);
  });
});
