const { strictEqual: eq, deepStrictEqual: deq, throws } = require('assert');

const { Libraries, Library } = require('..');

describe('Libraries', () => {
  it('should return compatible macros', () => {
    const libraries = new Libraries({ libraries: [new Library({ name: 'A' }).define('foo'), new Library({ name: 'B' }).define('bar'), new Library({ name: 'C' }).define('baz'), new Library({ name: 'D' }).define('bar')] });

    const step = { text: 'bar', generalised: 'bar' };
    const macros = libraries.getCompatibleMacros(step);
    eq(macros.length, 2);
    eq(macros[0].supports(step), true);
    eq(macros[1].supports(step), true);
  });

  it('should select libraries', () => {
    const libraries = new Libraries({ libraries: [new Library({ name: 'A' }).define('foo'), new Library({ name: 'B' }).define('bar'), new Library({ name: 'C' }).define('baz'), new Library({ name: 'D' }).define('bar')] }).select(['A', 'B', 'C']);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = libraries.getCompatibleMacros(step);
    eq(macros.length, 1);
    eq(macros[0].supports(step), true);
  });

  it('should dedupe libraries', () => {
    const libraries = new Libraries({ libraries: [new Library({ name: 'A' }).define('foo')] }).select(['A', 'A']);

    const step = { text: 'foo', generalised: 'foo' };
    const macros = libraries.getCompatibleMacros(step);
    eq(macros.length, 1);
    eq(macros[0].supports(step), true);
  });

  it('should error when a named library is not found', () => {
    throws(
      () => {
        new Libraries({ libraries: [] }).select(['A']);
      },
      { message: 'Library: A was not found' }
    );
  });

  it('should not select when passed no library names', () => {
    const libraries = new Libraries({ libraries: [new Library({ name: 'A' }).define('foo'), new Library({ name: 'B' }).define('bar'), new Library({ name: 'C' }).define('baz'), new Library({ name: 'D' }).define('bar')] }).select(undefined);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = libraries.getCompatibleMacros(step);
    eq(macros.length, 2);
  });

  it('should not select when passed an empty list', () => {
    const libraries = new Libraries({ libraries: [new Library({ name: 'A' }).define('foo'), new Library({ name: 'B' }).define('bar'), new Library({ name: 'C' }).define('baz'), new Library({ name: 'D' }).define('bar')] }).select([]);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = libraries.getCompatibleMacros(step);
    eq(macros.length, 2);
  });
});
