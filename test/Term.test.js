const expect = require('expect');

const { Term, Converters } = require('..');
const { PassthroughConverter } = Converters;

describe('Term', () => {

  it('should permit the right number of converters', () => {
    const converters = [ new PassthroughConverter(), new PassthroughConverter({ demand: 2 }) ];
    new Term({ expression: 'term', definition: /(.*) (.*) (.*)/, converters });
  });

  it('should default to a single wildcard term', () => {
    const term = new Term({ expression: 'term' });
    expect(term.definition).toBe('(.+)');
  });

  it('should report too many converter arguments', () => {
    const converters = [ new PassthroughConverter(), new PassthroughConverter({ demand: 2 }) ];
    expect(() => new Term({ expression: 'term', definition: /(.*)/, converters }))
      .toThrow('Pattern [(.*)] for term [term] has only 1 matching group, but 2 converters with a total of 3 arguments were specified');
  });

  it('should report too few converter arguments', () => {
    const converters = [ new PassthroughConverter() ];
    expect(() => new Term({ expression: 'term', definition: /(.*) (.*)/, converters }))
      .toThrow('Pattern [(.*) (.*)] for term [term] has 2 matching groups, but only 1 converter with a total of 1 argument was specified');
  });

  it('should report too few converters', () => {
    expect(() => new Term({ expression: 'term', definition: /(.*) (.*)/, converters: [] }))
      .toThrow('Pattern [(.*) (.*)] for term [term] has 2 matching groups, but no converters were specified');
  });

  it('should handle 0 in both directions');

  it('should indicate whether it resolves an expression');

});
