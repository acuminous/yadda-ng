const expect = require('expect');

const { Librarian, Library } = require('..');

describe('Librarian', () => {

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

  it('should filter libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).filter(['A', 'B', 'C']);

    const step = { text: 'bar', generalised: 'bar' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(1);
    expect(macros[0].supports(step)).toBe(true);
  });

  it('should not filter when passed no filters', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).filter();

    const step = { text: 'bar', generalised: 'bar' };
    const macros = librarian.getCompatibleMacros(step);
    expect(macros.length).toBe(2);
  });
});
