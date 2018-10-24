const debug = require('debug')('yadda:gherkish:events:UnexpectedEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class UnexpectedEvent extends BaseEvent {

  handle(source, session, state) {
    state.onUnexpectedEvent({ name: this.name, source, data: {} }, session);
    return true;
  }
};
