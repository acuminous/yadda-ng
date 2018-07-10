const expect = require('expect');

const { Languages, Librarian, Library } = require('..');
const { Pirate } = Languages;


describe('Librarian', () => {

  it('should return compatible macros', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] });

    const macros = librarian.getCompatibleMacros('bar');
    expect(macros.length).toBe(2);
    expect(macros[0].supports('bar')).toBe(true);
    expect(macros[1].supports('bar')).toBe(true);
  });

  it('should filter libraries', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).filter(['A', 'B', 'C']);

    const macros = librarian.getCompatibleMacros('bar');
    expect(macros.length).toBe(1);
    expect(macros[0].supports('bar')).toBe(true);
  });

  it('should not filter when passed no filters', () => {
    const librarian = new Librarian({ libraries: [
      new Library({ name: 'A' }).define('foo'),
      new Library({ name: 'B' }).define('bar'),
      new Library({ name: 'C' }).define('baz'),
      new Library({ name: 'D' }).define('bar'),
    ] }).filter();

    const macros = librarian.getCompatibleMacros('bar');
    expect(macros.length).toBe(2);
  });

  it('should suggest undefined steps in the default language', () => {
    const librarian = new Librarian({ libraries: [] });
    expect(librarian.suggest('Given some step')).toBe('.define(\'Given some step\', (state) => { // your code here })');
  });

  it('should suggest undefined steps in the specified language', () => {
    const librarian = new Librarian({ language: new Pirate(), libraries: [] });
    expect(librarian.suggest('Giveth some step')).toBe('.define(\'some step\', (state) => { // your code here })');
  });
});
