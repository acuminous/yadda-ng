const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');
const { Dictionary, Converters } = require('..');
const { UpperCaseConverter, LowerCaseConverter, PassThroughConverter } = Converters;

describe('Dictionary', () => {
  describe('Combination', () => {
    it('should combine multiple dictionaries', () => {
      const dictionary1 = new Dictionary().define('term1');
      const dictionary2 = new Dictionary().define('term2');
      const dictionary3 = new Dictionary().define('term3');

      const master = Dictionary.combine([dictionary1, dictionary2, dictionary3]);
      eq(master.defines('term1'), true);
      eq(master.defines('term2'), true);
      eq(master.defines('term3'), true);
    });

    it('should report duplicate definitions', () => {
      const dictionary1 = new Dictionary().define('term1');
      const dictionary2 = new Dictionary().define('term1');
      throws(() => Dictionary.combine([dictionary1, dictionary2]), { message: 'Duplicate term [term1]' });
    });
  });

  describe('Term Expansion', () => {
    it('should expand templates without terms to a fully matching pattern', () => {
      const dictionary = new Dictionary().define('no terms here', /.*/);
      eq(dictionary.expand('no terms here').regexp.source, '^no terms here$');
    });

    it('should expand undefined terms to a wild card pattern', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('$term').regexp.source, '^(.+)$');
    });

    it('should expand multiple terms', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('$term1 $term2 $term3').regexp.source, '^(.+) (.+) (.+)$');
      eq(dictionary.expand('$term1 meh $term2 meh $term3').regexp.source, '^(.+) meh (.+) meh (.+)$');
    });

    it('should expand the same term multiple times', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('$term $term $term').regexp.source, '^(.+) (.+) (.+)$');
      eq(dictionary.expand('$term meh $term meh $term').regexp.source, '^(.+) meh (.+) meh (.+)$');
    });

    it('should ignore an isolated term prefix', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('$').regexp.source, '^$$');
      eq(dictionary.expand('meh $ meh $ meh').regexp.source, '^meh $ meh $ meh$');
      eq(dictionary.expand('$ $term').regexp.source, '^$ (.+)$');
    });

    it('should subsitute simple terms', () => {
      const dictionary = new Dictionary().define('num', /(\d+)/).define('word', /(\w+)/);
      eq(dictionary.expand('$num').regexp.source, '^(\\d+)$');
      eq(dictionary.expand('$num $term $num').regexp.source, '^(\\d+) (.+) (\\d+)$');
      eq(dictionary.expand('$num meh $term meh $word').regexp.source, '^(\\d+) meh (.+) meh (\\w+)$');
    });

    it('should subsitute complex terms', () => {
      const dictionary = new Dictionary().define('address', '$number, $street').define('number', /(\d+)/).define('street', /(\w+)/);
      eq(dictionary.expand('$address').regexp.source, '^(\\d+), (\\w+)$');
    });

    it('should support custom prefix', () => {
      const dictionary = new Dictionary({ prefix: ':' });
      eq(dictionary.expand(':term').regexp.source, '^(.+)$');
      eq(dictionary.expand('\\:term').regexp.source, '^:term$');
    });
  });

  describe('Converters', () => {
    it('should default term converters', async () => {
      const dictionary = new Dictionary().define('term', /(.*)/);
      const { converters } = dictionary.expand('$term $term');
      eq(converters.length, 2);

      const values = await Promise.all([converters[0].convert({}, 1), converters[1].convert({}, 2)]);

      deq(values, [1, 2]);
    });

    it('should use the specified term converters', async () => {
      const dictionary = new Dictionary().define('term', /(.*) (.*)/, [new UpperCaseConverter(), new LowerCaseConverter()]);
      const { converters } = dictionary.expand('$term $term');
      eq(converters.length, 4);

      const values = await Promise.all([converters[0].convert({}, 'a'), converters[1].convert({}, 'A'), converters[2].convert({}, 'b'), converters[3].convert({}, 'B')]);

      deq(values, ['A', 'a', 'B', 'b']);
    });

    it('should allow singular term converters', async () => {
      const dictionary = new Dictionary().define('term', /(.*)/, new UpperCaseConverter());
      const { converters } = dictionary.expand('$term');
      eq(converters.length, 1);

      const value = await converters[0].convert({}, 'a');
      eq(value, 'A');
    });

    it('should raise an error when an expandable term is defined with too few converter arguments', () => {
      throws(() => new Dictionary().define('$term', /(.*)/, []), { message: 'Pattern [(.*)] for term [$term] has 1 matching group, but only a total of 0 converter arguments were specified' });
      throws(() => new Dictionary().define('$term', /(.*) (.*) (.*)/, [new PassThroughConverter({ demand: 2 })]), { message: 'Pattern [(.*) (.*) (.*)] for term [$term] has 3 matching groups, but only a total of 2 converter arguments were specified' });
    });

    it('should raise an error when an expandable term is defined with too many converter arguments', () => {
      throws(() => new Dictionary().define('$term', /(.*)/, [new PassThroughConverter(), new PassThroughConverter()]), { message: 'Pattern [(.*)] for term [$term] has only 1 matching group, but a total of 2 converter arguments were specified' });
      throws(() => new Dictionary().define('$term', /(.*)/, [new PassThroughConverter({ demand: 2 })]), { message: 'Pattern [(.*)] for term [$term] has only 1 matching group, but a total of 2 converter arguments were specified' });
    });
  });

  describe('Delimiting', () => {
    it('should delimit the term prefix', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('\\$').regexp.source, '^$$');
      eq(dictionary.expand('\\$ \\$ \\$').regexp.source, '^$ $ $$');
      eq(dictionary.expand('\\$term \\$term \\$term').regexp.source, '^$term $term $term$');
    });

    it('should delimit the delimiter', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('\\\\').regexp.source, '^\\$');
      eq(dictionary.expand('\\\\\\').regexp.source, '^\\\\$');
      eq(dictionary.expand('\\\\\\\\$term').regexp.source, '^\\\\(.+)$');
    });

    it('should maintain delimiter for non special characters', () => {
      const dictionary = new Dictionary();
      eq(dictionary.expand('\\w').regexp.source, '^\\w$');
    });

    it('should support custom delimiters', () => {
      const dictionary = new Dictionary({ delimiter: '^' });
      eq(dictionary.expand('^$').regexp.source, '^$$');
      eq(dictionary.expand('^^').regexp.source, '^^$');
    });
  });

  describe('Error Handling', () => {
    it('should report prefixes that are not single, non word characters', () => {
      throws(() => new Dictionary({ prefix: 'x' }), { message: 'Prefix [x] must be a single, non word character' });
      throws(() => new Dictionary({ prefix: '$$' }), { message: 'Prefix [$$] must be a single, non word character' });
    });

    it('should report delimiters that are not single, non word characters', () => {
      throws(() => new Dictionary({ delimiter: 'x' }), { message: 'Delimiter [x] must be a single, non word character' });
      throws(() => new Dictionary({ delimiter: '$$' }), { message: 'Delimiter [$$] must be a single, non word character' });
    });

    it('should require delimiters and prefixes to differ', () => {
      throws(() => new Dictionary({ delimiter: '$' }), { message: 'Prefix [$] and delimiter [$] must differ' });
      throws(() => new Dictionary({ prefix: '\\' }), { message: 'Prefix [\\] and delimiter [\\] must differ' });
    });

    it('should report invalid patterns', () => {
      throws(() => new Dictionary().expand('('), { message: 'Error expanding template [(]: Invalid regular expression: /^($/: Unterminated group' });
      throws(() => new Dictionary().expand('\\\\$term'), { message: "Error expanding template [\\\\$term]: Invalid regular expression: /^\\(.+)$/: Unmatched ')'" });
    });

    it('should report cyclic definitions', () => {
      const dictionary = new Dictionary().define('a', '$a').define('b', '$c').define('c', '$b');
      throws(() => dictionary.expand('$a'), { message: 'Cyclic definition for term [a]' });
      throws(() => dictionary.expand('$b'), { message: 'Indirect cyclic definition for term [b], with resolution history [b, c]' });
    });
  });
});
