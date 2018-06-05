const expect = require('expect');

const { Pattern } = require('..');

describe('Pattern', () => {

  it('should count matching groups', () => {
    expect(new Pattern(/.*/).countMatchingGroups()).toBe(0);
    expect(new Pattern(/(.*)/).countMatchingGroups()).toBe(1);
    expect(new Pattern(/(.*) (.*)/).countMatchingGroups()).toBe(2);
    expect(new Pattern(/((.*) (.*))/).countMatchingGroups()).toBe(3);
    expect(new Pattern(/(?:(.*)|(.*))/).countMatchingGroups()).toBe(2);
    expect(new Pattern(/(.*)|(.*)/).countMatchingGroups()).toBe(2);
  });

});
