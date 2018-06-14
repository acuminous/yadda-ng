const expect = require('expect');
const { Dictionary, Converters } = require('..');
const { UpperCaseConverter, LowerCaseConverter, PassthroughConverter } = Converters;

describe('Dictionary', () => {

  describe('Combination', () => {

    it('should combine multiple dictionaries', () => {
      const dictionary1 = new Dictionary().define('term1');
      const dictionary2 = new Dictionary().define('term2');
      const dictionary3 = new Dictionary().define('term3');

      const master = Dictionary.combine([dictionary1, dictionary2, dictionary3]);
      expect(master.defines('term1')).toBe(true);
      expect(master.defines('term2')).toBe(true);
      expect(master.defines('term3')).toBe(true);
    });

    it('should report duplicate definitions', () => {
      const dictionary1 = new Dictionary().define('term1');
      const dictionary2 = new Dictionary().define('term1');
      expect(() => Dictionary.combine([dictionary1, dictionary2])).toThrow('Duplicate term [term1]');
    });
  });

  describe('Term Expansion', () => {

    it('should expand templates without terms to a fully matching pattern', () => {
      const dictionary = new Dictionary()
        .define('no terms here', /.*/);
      expect(dictionary.expand('no terms here').pattern.source).toBe('^no terms here$');
    });

    it('should expand undefined terms to a wild card pattern', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('$term').pattern.source).toBe('^(.+)$');
    });

    it('should expand multiple terms', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('$term1 $term2 $term3').pattern.source).toBe('^(.+) (.+) (.+)$');
      expect(dictionary.expand('$term1 meh $term2 meh $term3').pattern.source).toBe('^(.+) meh (.+) meh (.+)$');
    });

    it('should expand the same term multiple times', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('$term $term $term').pattern.source).toBe('^(.+) (.+) (.+)$');
      expect(dictionary.expand('$term meh $term meh $term').pattern.source).toBe('^(.+) meh (.+) meh (.+)$');
    });

    it('should ignore an isolated term prefix', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('$').pattern.source).toBe('^$$');
      expect(dictionary.expand('meh $ meh $ meh').pattern.source).toBe('^meh $ meh $ meh$');
      expect(dictionary.expand('$ $term').pattern.source).toBe('^$ (.+)$');
    });

    it('should subsitute simple terms', () => {
      const dictionary = new Dictionary()
        .define('num', /(\d+)/)
        .define('word', /(\w+)/);
      expect(dictionary.expand('$num').pattern.source).toBe('^(\\d+)$');
      expect(dictionary.expand('$num $term $num').pattern.source).toBe('^(\\d+) (.+) (\\d+)$');
      expect(dictionary.expand('$num meh $term meh $word').pattern.source).toBe('^(\\d+) meh (.+) meh (\\w+)$');
    });

    it('should subsitute complex terms', () => {
      const dictionary = new Dictionary()
        .define('address', '$number, $street')
        .define('number', /(\d+)/)
        .define('street', /(\w+)/);
      expect(dictionary.expand('$address').pattern.source).toBe('^(\\d+), (\\w+)$');
    });

    it('should support custom prefix', () => {
      const dictionary = new Dictionary({ prefix: ':' });
      expect(dictionary.expand(':term').pattern.source).toBe('^(.+)$');
      expect(dictionary.expand('\\:term').pattern.source).toBe('^:term$');
    });
  });

  describe('Converters', () => {

    it('should default term converters', () => {
      const dictionary = new Dictionary().define('term', /(.*)/);
      const { converters } = dictionary.expand('$term $term');
      expect(converters.length).toBe(2);
      expect(converters[0].convert({}, 1)).resolves.toEqual([1]);
      expect(converters[1].convert({}, 2)).resolves.toEqual([2]);
    });

    it('should use the specified term converters', () => {
      const dictionary = new Dictionary().define('term', /(.*) (.*)/, [ new UpperCaseConverter(), new LowerCaseConverter() ] );
      const { converters } = dictionary.expand('$term $term');
      expect(converters.length).toBe(4);
      expect(converters[0].convert({}, 'a')).resolves.toEqual('A');
      expect(converters[1].convert({}, 'A')).resolves.toEqual('a');
      expect(converters[2].convert({}, 'b')).resolves.toEqual('B');
      expect(converters[3].convert({}, 'B')).resolves.toEqual('b');
    });

    it('should allow singular term converters', () => {
      const dictionary = new Dictionary().define('term', /(.*)/, new UpperCaseConverter() );
      const { converters } = dictionary.expand('$term');
      expect(converters.length).toBe(1);
      expect(converters[0].convert({}, 'a')).resolves.toEqual('A');
    });

    it('should raise an error when an expandable term is defined with too few converter arguments', () => {
      expect(() => new Dictionary().define('$term', /(.*)/, [])).toThrow('Pattern [(.*)] for term [$term] has 1 matching group, but only a total of 0 converter arguments were specified');
      expect(() => new Dictionary().define('$term', /(.*) (.*) (.*)/, [ new PassthroughConverter({ demand: 2 }) ])).toThrow('Pattern [(.*) (.*) (.*)] for term [$term] has 3 matching groups, but only a total of 2 converter arguments were specified');
    });

    it('should raise an error when an expandable term is defined with many few converter arguments', () => {
      expect(() => new Dictionary().define('$term', /(.*)/, [ new PassthroughConverter(), new PassthroughConverter() ])).toThrow('Pattern [(.*)] for term [$term] has only 1 matching group, but a total of 2 converter arguments were specified');
      expect(() => new Dictionary().define('$term', /(.*)/, [ new PassthroughConverter({ demand: 2 }) ])).toThrow('Pattern [(.*)] for term [$term] has only 1 matching group, but a total of 2 converter arguments were specified');
    });
  });

  describe('Delimiting', () => {
    it('should delimit the term prefix', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('\\$').pattern.source).toBe('^$$');
      expect(dictionary.expand('\\$ \\$ \\$').pattern.source).toBe('^$ $ $$');
      expect(dictionary.expand('\\$term \\$term \\$term').pattern.source).toBe('^$term $term $term$');
    });

    it('should delimit the delimiter', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('\\\\').pattern.source).toBe('^\\$');
      expect(dictionary.expand('\\\\\\').pattern.source).toBe('^\\\\$');
      expect(dictionary.expand('\\\\\\\\$term').pattern.source).toBe('^\\\\(.+)$');
    });

    it('should maintain delimiter for non special characters', () => {
      const dictionary = new Dictionary();
      expect(dictionary.expand('\\w').pattern.source).toBe('^\\w$');
    });

    it('should support custom delimiters', () => {
      const dictionary = new Dictionary({ delimiter: '^' });
      expect(dictionary.expand('^$').pattern.source).toBe('^$$');
      expect(dictionary.expand('^^').pattern.source).toBe('^^$');
    });
  });

  describe('Error Handling', () => {

    it('should report prefixes that are not single, non word characters', () => {
      expect(() => new Dictionary({ prefix: 'x' })).toThrow('Prefix [x] must be a single, non word character');
      expect(() => new Dictionary({ prefix: '$$' })).toThrow('Prefix [$$] must be a single, non word character');
    });

    it('should report delimiters that are not single, non word characters', () => {
      expect(() => new Dictionary({ delimiter: 'x' })).toThrow('Delimiter [x] must be a single, non word character');
      expect(() => new Dictionary({ delimiter: '$$' })).toThrow('Delimiter [$$] must be a single, non word character');
    });

    it('should require delimiters and prefixes to differ', () => {
      expect(() => new Dictionary({ delimiter: '$' })).toThrow('Prefix [$] and delimiter [$] must differ');
      expect(() => new Dictionary({ prefix: '\\' })).toThrow('Prefix [\\] and delimiter [\\] must differ');
    });

    it('should report invalid patterns', () => {
      expect(() => new Dictionary().expand('(')).toThrow('Error expanding template [(]: Invalid regular expression: /^($/: Unterminated group');
      expect(() => new Dictionary().expand('\\\\$term')).toThrow('Error expanding template [\\\\$term]: Invalid regular expression: /^\\(.+)$/: Unmatched \')\'');
    });

    it('should report cyclic definitions', () => {
      const dictionary = new Dictionary()
        .define('a', '$a')
        .define('b', '$c')
        .define('c', '$b');
      expect(() => dictionary.expand('$a')).toThrow('Cyclic definition for term [a]');
      expect(() => dictionary.expand('$b')).toThrow('Indirect cyclic definition for term [b], with resolution history [b, c]');
    });
  });
});
