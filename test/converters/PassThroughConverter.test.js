const expect = require('expect');

const { Converters } = require('../..');

describe('PassThroughConverter', () => {
  it('should pass through a single value', async () => {
    const converted = await new Converters.PassThroughConverter().convert({}, 1);
    expect(converted).toEqual(1);
  });

  it('should pass through a single value as an array', async () => {
    const converted = await new Converters.PassThroughConverter({ forceArray: true }).convert({}, 1);
    expect(converted).toEqual([1]);
  });

  it('should pass through a multiple values', async () => {
    const converted = await new Converters.PassThroughConverter({ demand: 2 }).convert({}, 1, 2);
    expect(converted).toEqual([1, 2]);
  });
});
