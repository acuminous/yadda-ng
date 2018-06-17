const debug = require('debug')('yadda-ng:Librarian');
const { UndefinedStep, AmbiguousStep, PendingStep, AsyncStep } = require('./Steps');
const Languages = require('./languages');

// The job of a librarian is to recommend the Step which best matches a step statement
module.exports = class Librarian {

  constructor({ libraries, language = Languages.default }) {
    this._libraries = libraries;
  }

  filter(names) {
    const libraries = names ? this._libraries.filter((library) => names.includes(library.name)) : this._libraries;
    return new Librarian({ libraries });
  }

  createStep(competition, annotations, statement) {
    const candidates = this._getCandidateMacros(statement);
    const ranked = competition.rank(candidates, statement);
    return this._createStep(annotations, statement, ranked);
  }

  _getCandidateMacros(statement) {
    return this._libraries.reduce((macros, library) => {
      return macros.concat(library.getCandidateMacros(statement));
    }, []);
  }

  _createStep(annotations, statement, ranked) {
    if (ranked.winner && ranked.winner.isPending()) return new PendingStep({ statement, macro: ranked.winner });
    if (ranked.winner) return new AsyncStep({ annotations, statement, macro: ranked.winner });
    if (ranked.contenders) return new AmbiguousStep({ statement, contenders: ranked.contenders });
    return new UndefinedStep({ statement, language: this._language });
  }
};
