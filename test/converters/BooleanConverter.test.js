const { strictEqual: eq, deepStrictEqual: deq, rejects } = require('assert');

const { Converters } = require('../..');

describe('BooleanConverter', () => {
  it('should convert a string to a boolean', async () => {
    eq(await new Converters.BooleanConverter().convert({}, 'true'), true);
    eq(await new Converters.BooleanConverter().convert({}, 'True'), true);
    eq(await new Converters.BooleanConverter().convert({}, 'TRUE'), true);
    eq(await new Converters.BooleanConverter().convert({}, 'false'), false);
    eq(await new Converters.BooleanConverter().convert({}, 'False'), false);
    eq(await new Converters.BooleanConverter().convert({}, 'FALSE'), false);
  });

  it('should report unparsable booleans', async () => {
    await rejects(new Converters.BooleanConverter().convert({}, 'foo'), { message: 'Cannot convert value [foo] to a boolean' });
  });
});
