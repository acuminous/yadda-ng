const expect = require('expect');

const { Converters } = require('../..');

describe('UpperCaseConverter', () => {

  it('should convert a string to a float', async () => {
    const converted = await new Converters.UpperCaseConverter().convert({}, 'a');
    expect(converted).toBe('A');
  });

});
