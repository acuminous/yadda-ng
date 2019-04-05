const Debug = require('debug');
const BaseEvent = require('./BaseEvent');

module.exports = class UnexpectedEvent extends BaseEvent {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:gherkish:events:UnexpectedEvent'),
    } = props;

    super({ debug });
  }

  handle(source, session, state) {
    state.onUnexpectedEvent({ name: this.name, source, data: {} }, session);
    return true;
  }
};
