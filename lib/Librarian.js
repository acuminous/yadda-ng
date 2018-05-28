const debug = require('debug')('yadda-ng:Librarian');
const { UndefinedStep, AmbiguousStep } = require('./Steps');

module.exports = class Librarian {

  constructor({ libraries }) {
    this._libraries = libraries;
  }

  filter(names) {
    const libraries = names ? this._libraries.filter((library) => names.includes(library.name)) : this._libraries;
    return new Librarian({ libraries });
  }

  makeStep(annotations, text) {
    const candidates = this._getCandidateMacros(text);
    const ranked = this._rank(candidates);
    return this._makeStep(annotations, text, ranked);
  }

  _getCandidateMacros(text) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCandidateMacros(text));
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

  _makeStep(annotations, text, ranked) {
    if (ranked.empty) return new UndefinedStep({ text });
    if (ranked.winner) return ranked.winner.toStep(annotations, text);
    return new AmbiguousStep({ text, contenders: ranked.contenders });
  }
};
