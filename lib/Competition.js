const debug = require('debug')('yadda-ng:Competition');

// The job of a Competition is to rank macros
module.exports = class Competition {

  rank(candidates, statement) {
    if (candidates.length === 0 ) return this._noContenders();
    const scored = candidates.map((macro) => ({ macro, score: this._score(macro) }));
    const highest = scored.reduce((highest, candidate) => Math.max(highest, candidate.score), 0);
    const contenders = scored.filter((candidate) => candidate.score === highest).map((candidate) => candidate.macro);
    if (contenders.length === 1) return this._winner(contenders[0]);
    return this._contenders(contenders);
  }

  _noContenders() {
    this._previousWinner = null;
    return {};
  }

  _winner(winner) {
    this._previousWinner = winner;
    return { winner };
  }

  _contenders(contenders) {
    this._previousWinner = null;
    return { contenders };
  }

  _score(macro) {
    return this._previousWinner && macro.isFromSameLibrary(this._previousWinner) ? 1 : 0;
  }
};
