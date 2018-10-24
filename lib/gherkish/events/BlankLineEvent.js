const debug = require('debug')('yadda:gherkish:events:BlankLineEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class BlankLineEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*$/ });
  }

  notify(source, session, state, match) {
    state.onBlankLine({ name: this.name, source, data: {} }, session);
  }
};
