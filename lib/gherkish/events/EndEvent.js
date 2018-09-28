const BaseEvent = require('./BaseEvent');

module.exports = class EndEvent extends BaseEvent {

  constructor() {
    super({ name: 'end', regexp: /^\u0000$/ });
  }

  handle(source, session) {
    this._match(source, session);
    const data = {};
    session.machine.onEnd({ name: this.name, source, data }, session);
  }
};
