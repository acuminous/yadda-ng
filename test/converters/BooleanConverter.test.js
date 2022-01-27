const expect = require('expect');

const { Converters } = require('../..');

describe('BooleanConverter', () => {
  it('should convert a string to a boolean', async () => {
    expect(new Converters.BooleanConverter().convert({}, 'true')).resolves.toBe(true);
    expect(new Converters.BooleanConverter().convert({}, 'True')).resolves.toBe(true);
    expect(new Converters.BooleanConverter().convert({}, 'TRUE')).resolves.toBe(true);
    expect(new Converters.BooleanConverter().convert({}, 'false')).resolves.toBe(false);
    expect(new Converters.BooleanConverter().convert({}, 'False')).resolves.toBe(false);
    expect(new Converters.BooleanConverter().convert({}, 'FALSE')).resolves.toBe(false);
  });

  it('should report unparsable booleans', async () => {
    expect(new Converters.BooleanConverter().convert({}, 'foo')).rejects.toThrow('Cannot convert value [foo] to a boolean');
  });
});
