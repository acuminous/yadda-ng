const expect = require('expect');

const { Converters } = require('../..');

describe('PassthroughConverter', () => {

  it('should pass through a single value', async () => {
    const converted = await new Converters.PassthroughConverter().convert({}, 1);
    expect(converted).toEqual([1]);
  });

  it('should pass through a multiple values', async () => {
    const converted = await new Converters.PassthroughConverter({ demand: 2 }).convert({}, 1, 2);
    expect(converted).toEqual([1, 2]);
  });

});
