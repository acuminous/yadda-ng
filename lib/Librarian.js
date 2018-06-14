const debug = require('debug')('yadda-ng:Librarian');
const { UndefinedStep, AmbiguousStep, PendingStep, AsyncStep } = require('./Steps');

// A Librarian finds the best matching step from a collection of libraries,
module.exports = class Librarian {

  constructor({ libraries }) {
    this._libraries = libraries;
  }

  filter(names) {
    const libraries = names ? this._libraries.filter((library) => names.includes(library.name)) : this._libraries;
    return new Librarian({ libraries });
  }

  createStep(annotations, statement) {
    const candidates = this._getCandidateMacros(statement);
    const ranked = this._rank(candidates);
    return this._createStep(annotations, statement, ranked);
  }

  _getCandidateMacros(statement) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCandidateMacros(statement));
    }, []);
  }

  _rank(candidates) {
    const scored = candidates.map((macro, index) => ({ macro, score: index }));
    const highest = scored.reduce((highest, candidate) => Math.max(highest, candidate.score), 0);
    const contenders = scored.filter((candidate) => candidate.score === highest).map((candidate) => candidate.macro);
    if (scored.length === 0 ) return { empty: true };
    if (contenders.length === 1) return { winner: contenders[0] };
    return { contenders };
  }

  _createStep(annotations, statement, ranked) {
    if (ranked.empty) return new UndefinedStep({ statement });
    if (ranked.winner && ranked.winner.isPending()) return new PendingStep({ statement, macro: ranked.winner });
    if (ranked.winner) return new AsyncStep({ annotations, statement, macro: ranked.winner });
    return new AmbiguousStep({ statement, contenders: ranked.contenders });
  }
};
