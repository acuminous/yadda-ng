const BaseEvent = require('./BaseEvent');

module.exports = class BackgroundEvent extends BaseEvent {

  constructor() {
    super({ name: 'background' });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { title: match[1].trim() };
    session.machine.onBackground({ name: this.name, source, data }, session);
  }
};
