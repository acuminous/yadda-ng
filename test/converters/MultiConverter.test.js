const expect = require('expect');

const { Converters } = require('../..');

describe('MultiConverter', () => {
  it('should combine multiple converters', async () => {
    const converter1 = new Converters.LowerCaseConverter();
    const converter2 = new Converters.UpperCaseConverter();
    const multiConverter = new Converters.MultiConverter({ converters: [converter1, converter2] });
    const converted = await multiConverter.convert({}, ['A', 'b']);
    expect(converted.length).toBe(2);
    expect(converted[0]).toBe('a');
    expect(converted[1]).toBe('B');
  });

  it('should report the argument demand', async () => {
    const converter1 = new Converters.LowerCaseConverter();
    const converter2 = new Converters.UpperCaseConverter();
    const multiConverter = new Converters.MultiConverter({ converters: [converter1, converter2] });
    expect(multiConverter.demand).toBe(2);
  });
});
