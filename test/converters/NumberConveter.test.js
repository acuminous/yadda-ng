const expect = require('expect');

const { Converters } = require('../..');

describe('NumberConverter', () => {

  it('should convert a string to a float', async () => {
    const converted = await new Converters.NumberConverter().convert({}, '1');
    expect(converted).toBe(1);
  });

  it('should convert a string to a float', async () => {
    const converted = await new Converters.NumberConverter().convert({}, '1.1');
    expect(converted).toBe(1.1);
  });

  it('should convert a bogus string to NaN', async () => {
    const converted = await new Converters.NumberConverter().convert({}, 'meh');
    expect(converted).toBe(NaN);
  });

});
