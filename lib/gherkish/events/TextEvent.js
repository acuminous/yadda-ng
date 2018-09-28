const BaseEvent = require('./BaseEvent');

module.exports = class TextEvent extends BaseEvent {

  constructor() {
    super({ name: 'text', regexp: /^(.*)$/ });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { text: match[0].trim() };
    session.machine.onText({ name: this.name, source, data }, session);
  }
};
