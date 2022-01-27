const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');

const { Term, Converters, Dictionary } = require('..');
const { PassThroughConverter } = Converters;

describe('Term', () => {
  it('should indicate whether it resolves an expression', () => {
    eq(new Term({ expression: 'term' }).resolves('term'), true);
    eq(new Term({ expression: 'term' }).resolves('xterm'), false);
  });

  it('should permit the right number of converters', () => {
    const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
    new Term({ expression: 'term', definition: /(.*) (.*) (.*)/, converters });
  });

  it('should define itself in the given dictionary', () => {
    const dictionary = new Dictionary();
    const term = new Term({ expression: 'term' });
    term.defineIn(dictionary);
    eq(dictionary.defines('term'), true);
  });

  it('should default to a single wildcard term with passthrough converter', () => {
    const term = new Term({ expression: 'term' });
    eq(term.definition, '(.+)');
  });

  it('should report too many converter arguments', () => {
    const converters = [new PassThroughConverter(), new PassThroughConverter({ demand: 2 })];
    throws(() => new Term({ expression: 'term', definition: /(.*)/, converters }), { message: 'Pattern [(.*)] for term [term] has only 1 matching group, but a total of 3 converter arguments were specified' });
  });

  it('should report too few converter arguments', () => {
    const converters = [new PassThroughConverter()];
    throws(() => new Term({ expression: 'term', definition: /(.*) (.*)/, converters }), { message: 'Pattern [(.*) (.*)] for term [term] has 2 matching groups, but only a total of 1 converter argument was specified' });
  });
});
