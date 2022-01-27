const expect = require('expect');

const { Converters } = require('../..');

describe('LowerCaseConverter', () => {
  it('should convert a string to a float', async () => {
    const converted = await new Converters.LowerCaseConverter().convert({}, 'A');
    expect(converted).toBe('a');
  });
});
