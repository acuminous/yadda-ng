const expect = require('expect');

const { Dictionary } = require('..');

describe('Dictionary', () => {

  describe('Combination', () => {
    xit('should combine multiple dictionaries');
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

  xdescribe('Converters', () => {
    it('should default term converters', () => {
      const dictionary = new Dictionary()
        .define('term', /(.*)/);
      const expanded = dictionary.expand('$term $term');
      expect(expanded.converters.length).toBe(2);
      expect(expanded.conveters[0].convert({}, 1)).resolves.toBe(1);
      expect(expanded.conveters[1].convert({}, 1)).resolves.toBe(1);
    });

    it('should use the specified term converter', () => {

    });

    xit('should raise an error when an expandable term is defined with the wrong number of converters', () => {
      expect(new Dictionary().define('$term', /(.*)/, [])).toThrow('Meh!');
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
      expect(() => new Dictionary().expand('(')).toThrow('Error parsing template [(]: Invalid regular expression: /^($/: Unterminated group');
      expect(() => new Dictionary().expand('\\\\$term')).toThrow('Error parsing template [\\\\$term]: Invalid regular expression: /^\\(.+)$/: Unmatched \')\'');
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
