const debug = require('debug')('yadda:gherkish:events:EndEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class EndEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\u0000$/ });
  }

  notify(source, session, state, match) {
    state.onEnd({ name: this.name, source, data: {} }, session);
  }
};
