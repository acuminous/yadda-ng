module.exports = class Competition {
  rank(state, candidates) {
    const contenders = this._shortlist(state, candidates);
    if (contenders.length === 0) return {};
    if (contenders.length === 1) return { winner: contenders[0] };
    return { contenders };
  }

  _shortlist(state, candidates) {
    const scored = candidates.map((macro) => ({ macro, score: this._score(state, macro) }));
    const highest = scored.reduce((highest, candidate) => Math.max(highest, candidate.score), 0);
    return scored.filter((candidate) => candidate.score === highest).map((candidate) => candidate.macro);
  }

  /*
   TODO store a refrence to library on Macro and in state
   Then call state.get('currentLibrary').defines(macro)
  */
  _score(state, macro) {
    return macro.isFromLibrary(state.get('currentLibrary')) ? 1 : 0;
  }
};
