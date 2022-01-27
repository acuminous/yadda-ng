const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Pattern } = require('..');

describe('Pattern', () => {
  it('should indicate when it supports some text', () => {
    eq(new Pattern(/foo/).supports('foo'), true);
    eq(new Pattern(/foo/).supports('bar'), false);
  });

  it('should indicate when it equals another pattern', () => {
    eq(new Pattern(/foo/).equals(/foo/), true);
    eq(new Pattern(/foo/).equals(/bar/), false);
  });

  it('should execute repeatedly', () => {
    const pattern = new Pattern(/(.*) (.*)/);
    eq(pattern.exec('a b').length, 3);
    eq(pattern.exec('a b').length, 3);
  });

  it('should count matching groups', () => {
    eq(new Pattern(/.*/).countMatchingGroups(), 0);
    eq(new Pattern(/(.*)/).countMatchingGroups(), 1);
    eq(new Pattern(/(.*) (.*)/).countMatchingGroups(), 2);
    eq(new Pattern(/((.*) (.*))/).countMatchingGroups(), 3);
    eq(new Pattern(/(?:(.*)|(.*))/).countMatchingGroups(), 2);
    eq(new Pattern(/(.*)|(.*)/).countMatchingGroups(), 2);
  });
});
