const expect = require('expect');

const { Dictionary } = require('..');

describe('Dictionary', () => {

  describe('Term Expansion', () => {

    it('should expand templates without terms to a fully matching pattern', () => {
      expect(source('no terms here')).toBe('^no terms here$');
    });

    it('should expand undefined terms to a wild card pattern', () => {
      expect(source('$term')).toBe('^(.+)$');
    });

    it('should expand multiple terms', () => {
      expect(source('$term1 $term2 $term3')).toBe('^(.+) (.+) (.+)$');
      expect(source('meh $term1 meh $term2 meh $term3 meh')).toBe('^meh (.+) meh (.+) meh (.+) meh$');
    });

    it('should expand the same term multiple times', () => {
      expect(source('$term $term $term')).toBe('^(.+) (.+) (.+)$');
      expect(source('meh $term meh $term meh $term meh')).toBe('^meh (.+) meh (.+) meh (.+) meh$');
    });

    it('should ignore an isolated term prefix', () => {
      expect(source('$')).toBe('^$$');
      expect(source('meh $ meh $ meh')).toBe('^meh $ meh $ meh$');
      expect(source('$ $term')).toBe('^$ (.+)$');
    });

    it('should subsitute simple terms', () => {
      const dictionary = new Dictionary().define('num', /(\d+)/).define('word', /(\w+)/);
      expect(source('$num', dictionary)).toBe('^(\\d+)$');
      expect(source('$num $term $num', dictionary)).toBe('^(\\d+) (.+) (\\d+)$');
      expect(source('$num meh $term meh $word', dictionary)).toBe('^(\\d+) meh (.+) meh (\\w+)$');
    });

    it('should subsitute complex terms', () => {
      const dictionary = new Dictionary()
        .define('address', '$number, $street')
        .define('number', /(\d+)/)
        .define('street', /(\w+)/);
      expect(source('$address', dictionary)).toBe('^(\\d+), (\\w+)$');
    });

    it('should support custom prefix', () => {
      expect(source(':term', new Dictionary({ prefix: ':' }))).toBe('^(.+)$');
      expect(source('\\:term', new Dictionary({ prefix: ':' }))).toBe('^:term$');
    });
  });

  describe('Delimiting', () => {
    it('should delimit the term prefix', () => {
      expect(source('\\$')).toBe('^$$');
      expect(source('\\$ \\$ \\$')).toBe('^$ $ $$');
      expect(source('\\$term \\$term \\$term')).toBe('^$term $term $term$');
    });

    it('should delimit the delimiter', () => {
      expect(source('\\\\')).toBe('^\\$');
      expect(source('\\\\\\')).toBe('^\\\\$');
      expect(source('\\\\\\\\$term')).toBe('^\\\\(.+)$');
    });

    it('should maintain delimiter for non special characters', () => {
      expect(source('\\w')).toBe('^\\w$');
    });

    it('should support custom delimiters', () => {
      expect(source('^$', new Dictionary({ delimiter: '^' }))).toBe('^$$');
      expect(source('^^', new Dictionary({ delimiter: '^' }))).toBe('^^$');
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
      expect(() => source('(')).toThrow('Error parsing template [(]: Invalid regular expression: /^($/: Unterminated group');
      expect(() => source('\\\\$term')).toThrow('Error parsing template [\\\\$term]: Invalid regular expression: /^\\(.+)$/: Unmatched \')\'');
    });

    it('should report cyclic definitions', () => {
      const dictionary = new Dictionary()
        .define('a', '$a')
        .define('b', '$c')
        .define('c', '$b');
      expect(() => source('$a', dictionary)).toThrow('Cyclic definition for term [a]');
      expect(() => source('$b', dictionary)).toThrow('Indirect cyclic definition for term [b], with resolution history [b, c]');
    });
  });

  function source(template, dictionary = new Dictionary()) {
    return dictionary.expand(template).pattern.source;
  }
});
