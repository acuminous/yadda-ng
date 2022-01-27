const expect = require('expect');

const { Term, Converters, Dictionary } = require('..');
const { PassThroughConverter } = Converters;

describe('Term', () => {
  it('should indicate whether it resolves an expression', () => {
    expect(new Term({ expression: 'term' }).resolves('term')).toBe(true);
    expect(new Term({ expression: 'term' }).resolves('xterm')).toBe(false);
  });

  it('should permit the right number of converters', () => {
    const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
    new Term({ expression: 'term', definition: /(.*) (.*) (.*)/, converters });
  });

  it('should define itself in the given dictionary', () => {
    const dictionary = new Dictionary();
    const term = new Term({ expression: 'term' });
    term.defineIn(dictionary);
    expect(dictionary.defines('term')).toBe(true);
  });

  it('should default to a single wildcard term with passthrough converter', () => {
    const term = new Term({ expression: 'term' });
    expect(term.definition).toBe('(.+)');
  });

  it('should report too many converter arguments', () => {
    const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
    expect(() => new Term({ expression: 'term', definition: /(.*)/, converters })).toThrow('Pattern [(.*)] for term [term] has only 1 matching group, but a total of 3 converter arguments were specified');
  });

  it('should report too few converter arguments', () => {
    const converters = [new PassThroughConverter()];
    expect(() => new Term({ expression: 'term', definition: /(.*) (.*)/, converters })).toThrow('Pattern [(.*) (.*)] for term [term] has 2 matching groups, but only a total of 1 converter argument was specified');
  });
});
