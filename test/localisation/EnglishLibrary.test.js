const expect = require('expect');

const { Localisation } = require('../..');
const { EnglishLibrary } = Localisation;

describe('English Library', () => {

  it('should generalise steps', () => {
    const library = new EnglishLibrary();
    ['given', 'with', 'when', 'if', 'then', 'and', 'but', 'except'].forEach((word) => {
      expect(library.generalise(`${word.toUpperCase()} something`)).toBe('something');
      expect(library.generalise(`${word.toLowerCase()} something`)).toBe('something');
    });
  });

  it('should decorate library', () => {
    const library = new EnglishLibrary().given('A').when('B').then('C');
    ['given', 'with', 'when', 'if', 'then', 'and', 'but', 'except'].forEach((word) => {
      ['A', 'B', 'C'].forEach((letter) => {
        expect(library.getCandidateMacros(`${word.toUpperCase()} ${letter}`).length).toBe(1);
        expect(library.getCandidateMacros(`${word.toLowerCase()} ${letter}`).length).toBe(1);
      });
    });
  });

  it('should report duplicate localised steps', () => {
    expect(() => new EnglishLibrary({ name: 'localised' }).given('A').when('A')).toThrow('Macro pattern [/^A$/] derived from template [A] defined in library [localised] is a duplicate of pattern [/^A$/] derived from template [A] defined in library [localised]');
  });
});
