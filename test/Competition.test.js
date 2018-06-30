const expect = require('expect');

const { Competition, Macro, Pattern, Library } = require('..');

describe('Competition', () => {

  it('should record no winner and no contenders when there are no candidates', () => {
    const ranked = new Competition().rank({}, []);
    expect(ranked.winner).toBe(undefined);
    expect(ranked.contenders).toBe(undefined);
  });

  it('should record winner and no contenders when there is only one candidate', () => {
    const competition = new Competition();
    const library = new Library();
    const macro = new Macro({ library, pattern: new Pattern(/A/) });

    const ranked = competition.rank({}, [ macro ]);
    expect(ranked.winner).toBe(macro);
    expect(ranked.contenders).toBe(undefined);
  });

  it('should record contenders when there is no clear winner', () => {
    const competition = new Competition();
    const libraryA = new Library({ name: 'A' });
    const libraryB = new Library({ name: 'B' });
    const macro1 = new Macro({ library: libraryA, pattern: new Pattern(/A/) });
    const macro2 = new Macro({ library: libraryA, pattern: new Pattern(/B/) });
    const macro3 = new Macro({ library: libraryB, pattern: new Pattern(/C/) });

    const ranked = competition.rank({}, [ macro1, macro2, macro3 ]);
    expect(ranked.winner).toBe(undefined);
    expect(ranked.contenders.length).toBe(3);
    expect(ranked.contenders).toEqual([ macro1, macro2, macro3 ]);
  });

  it('should prefer macro from previous winner\'s library', () => {
    const competition = new Competition();
    const libraryA = new Library({ name: 'A' });
    const libraryB = new Library({ name: 'B' });
    const macro1 = new Macro({ library: libraryA, pattern: new Pattern(/A/) });
    const macro2 = new Macro({ library: libraryA, pattern: new Pattern(/B/) });
    const macro3 = new Macro({ library: libraryB, pattern: new Pattern(/C/) });

    const ranked = competition.rank({ currentLibrary: 'B' }, [ macro1, macro2, macro3 ]);
    expect(ranked.winner).toBe(macro3);
    expect(ranked.contenders).toBe(undefined);
  });
});
