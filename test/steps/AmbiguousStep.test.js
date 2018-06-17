const expect = require('expect');

const { Steps, Macro, Pattern, Library } = require('../..');
const { AmbiguousStep } = Steps;

describe('AmbiguousStep', () => {

  it('should pretend to run step', () => {
    expect(new AmbiguousStep({ statement: 'Given A', contenders: [] }).pretend()).toBe('ambiguous');
  });

  it('should run step', async () => {
    const library = new Library();
    const macro = new Macro({ library, pattern: new Pattern(/.*/), fn: () => {} });
    expect(() => new AmbiguousStep({ statement: 'Given A', contenders: [ macro ] }).run())
      .toThrow('Ambiguous Step: [Given A] is equally matched by macro with pattern [/.*/] defined in library [Library]');
  });

  it('should not be pending', () => {
    expect(new AmbiguousStep({ statement: 'Given A', contenders: [] }).isPending()).toBe(false);
  });

});
