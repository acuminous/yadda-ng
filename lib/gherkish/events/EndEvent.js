const debug = require('debug')('yadda:gherkish:events:EndEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class EndEvent extends BaseEvent {

  constructor() {
    super({ name: 'end', regexp: /^\u0000$/ });
  }

  _handle(source, session, state) {
    this._match(source, session);
    const data = {};
    state.onEnd({ name: this.name, source, data }, session);
  }
};
