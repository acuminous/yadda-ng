const debug = require('debug')('yadda:gherkish:events:UnexpectedEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class AnnotationEvent extends BaseEvent {

  constructor() {
    super({ name: 'unexpected' });
  }

  test() {
    return true;
  }

  match() {
  }

  notify(source, session, state, match) {
    state.onUnexpectedEvent({ name: this.name, source, data: {} }, session);
  }
};
