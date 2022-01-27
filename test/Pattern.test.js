const expect = require('expect');

const { Pattern } = require('..');

describe('Pattern', () => {
  it('should indicate when it supports some text', () => {
    expect(new Pattern(/foo/).supports('foo')).toBe(true);
    expect(new Pattern(/foo/).supports('bar')).toBe(false);
  });

  it('should indicate when it equals another pattern', () => {
    expect(new Pattern(/foo/).equals(/foo/)).toBe(true);
    expect(new Pattern(/foo/).equals(/bar/)).toBe(false);
  });

  it('should execute repeatedly', () => {
    const pattern = new Pattern(/(.*) (.*)/);
    expect(pattern.exec('a b').length).toBe(3);
    expect(pattern.exec('a b').length).toBe(3);
  });

  it('should count matching groups', () => {
    expect(new Pattern(/.*/).countMatchingGroups()).toBe(0);
    expect(new Pattern(/(.*)/).countMatchingGroups()).toBe(1);
    expect(new Pattern(/(.*) (.*)/).countMatchingGroups()).toBe(2);
    expect(new Pattern(/((.*) (.*))/).countMatchingGroups()).toBe(3);
    expect(new Pattern(/(?:(.*)|(.*))/).countMatchingGroups()).toBe(2);
    expect(new Pattern(/(.*)|(.*)/).countMatchingGroups()).toBe(2);
  });
});
