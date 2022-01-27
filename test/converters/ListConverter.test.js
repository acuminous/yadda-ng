const expect = require('expect');

const { Converters } = require('../..');
const { ListConverter, NumberConverter } = Converters;

describe('ListConverter', () => {
  it('should convert rows to a list', async () => {
    const converted = await new ListConverter().convert({}, '1\n2\n3');
    expect(converted.valueOf()).toEqual(['1', '2', '3']);
  });

  it('should convert comma separated values to a list', async () => {
    const converted = await new ListConverter({ regexp: /, / }).convert({}, '1, 2, 3');
    expect(converted.valueOf()).toEqual(['1', '2', '3']);
  });

  it('should convert list items', async () => {
    const converted = await new ListConverter({ converter: new NumberConverter() }).convert({}, '1\n2\n3');
    expect(converted.valueOf()).toEqual([1, 2, 3]);
  });
});
