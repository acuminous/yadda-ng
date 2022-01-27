const expect = require('expect');

const { Converters } = require('../..');

describe('DateConverter', () => {
  it('should convert a string to a date', async () => {
    const converted = await new Converters.DateConverter().convert({}, '1/1/18 00:00:00.000Z');
    expect(converted.toISOString()).toBe('2018-01-01T00:00:00.000Z');
  });

  it('should report unparsable dates', async () => {
    expect(new Converters.DateConverter().convert({}, 'foo')).rejects.toThrow('Cannot convert value [foo] to a date');
  });
});
