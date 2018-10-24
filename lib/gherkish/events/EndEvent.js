const debug = require('debug')('yadda:gherkish:events:EndEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class EndEvent extends BaseEvent {

  constructor() {
    super({ regexp: /^\u0000$/ });
  }

  notify(source, session, state, match) {
    state.onEnd({ name: this.name, source, data: {} }, session);
  }
};
