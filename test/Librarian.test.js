const expect = require('expect');

const { Librarian, Library } = require('..');

describe.only('Librarian', () => {

  it('should return compatible macros', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] });

    const step = { text: 'bar', generalised: 'bar' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(2);
    expect(macros[0].supports(step)).toBe(true);
    expect(macros[1].supports(step)).toBe(true);
  });

  it('should select libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).select(['A', 'B', 'C']);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(1);
    expect(macros[0].supports(step)).toBe(true);
  });

  it('should dedupe libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
    ] }).select(['A', 'A']);

    const step = { text: 'foo', generalised: 'foo' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(1);
    expect(macros[0].supports(step)).toBe(true);
  });

  it('should error when a named library is not found', () => {
    expect(() => {
      new Librarian({ libraries: [] }).select(['A']);
    }).toThrow('Library: A was not found');
  });

  it('should not select when passed no library names', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).select(undefined);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(2);
  });

  it('should not select when passed an empty list', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).select([]);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(2);
  });
});
