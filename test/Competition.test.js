const { strictEqual: eq, deepStrictEqual: deq } = require('assert');

const { Competition, Macro, Pattern, Library, Signature, State } = require('..');

describe('Competition', () => {
  it('should record no winner and no contenders when there are no candidates', () => {
    const ranked = new Competition().rank(new State(), []);
    eq(ranked.winner, undefined);
    eq(ranked.contenders, undefined);
  });

  it('should record winner and no contenders when there is only one candidate', () => {
    const competition = new Competition();
    const library = new Library();
    const signature = new Signature({ library, pattern: new Pattern(/A/) });
    const macro = new Macro({ signature });

    const ranked = competition.rank(new State(), [macro]);
    eq(ranked.winner, macro);
    eq(ranked.contenders, undefined);
  });

  it('should record contenders when there is no clear winner', () => {
    const competition = new Competition();
    const library1 = new Library({ name: 'A' });
    const library2 = new Library({ name: 'B' });

    const signature1 = new Signature({ library: library1, pattern: new Pattern(/A/) });
    const signature2 = new Signature({ library: library1, pattern: new Pattern(/B/) });
    const signature3 = new Signature({ library: library2, pattern: new Pattern(/C/) });

    const macro1 = new Macro({ signature: signature1 });
    const macro2 = new Macro({ signature: signature2 });
    const macro3 = new Macro({ signature: signature3 });

    const ranked = competition.rank(new State(), [macro1, macro2, macro3]);
    eq(ranked.winner, undefined);
    eq(ranked.contenders.length, 3);
    deq(ranked.contenders, [macro1, macro2, macro3]);
  });

  it("should prefer macro from previous winner's library", () => {
    const competition = new Competition();
    const library1 = new Library({ name: 'A' });
    const library2 = new Library({ name: 'B' });

    const signature1 = new Signature({ library: library1, pattern: new Pattern(/A/) });
    const signature2 = new Signature({ library: library1, pattern: new Pattern(/B/) });
    const signature3 = new Signature({ library: library2, pattern: new Pattern(/C/) });

    const macro1 = new Macro({ signature: signature1 });
    const macro2 = new Macro({ signature: signature2 });
    const macro3 = new Macro({ signature: signature3 });

    const state = new State();
    state.set('currentLibrary', 'B');
    const ranked = competition.rank(state, [macro1, macro2, macro3]);
    eq(ranked.winner, macro3);
    eq(ranked.contenders, undefined);
  });
});
