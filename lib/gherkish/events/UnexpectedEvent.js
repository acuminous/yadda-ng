const debug = require('debug')('yadda:gherkish:events:UnexpectedEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class AnnotationEvent extends BaseEvent {

  constructor() {
    super({ name: 'text' });
  }

  test() {
    return true;
  }

  _handle(source, session, state) {
    state.onUnexpectedEvent({ name: this.name, source, data: {} }, session);
  }
};
