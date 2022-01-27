const { strictEqual: eq, deepStrictEqual: deq, rejects } = require('assert');

const { Converters } = require('../..');

describe('DateConverter', () => {
  it('should convert a string to a date', async () => {
    const converted = await new Converters.DateConverter().convert({}, '1/1/18 00:00:00.000Z');
    eq(converted.toISOString(), '2018-01-01T00:00:00.000Z');
  });

  it('should report unparsable dates', async () => {
    await rejects(new Converters.DateConverter().convert({}, 'foo'), { message: 'Cannot convert value [foo] to a date' });
  });
});
