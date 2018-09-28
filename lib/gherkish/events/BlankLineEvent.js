const BaseEvent = require('./BaseEvent');

module.exports = class BlankLineEvent extends BaseEvent {

  constructor() {
    super({ name: 'blank_line', regexp: /^\s*$/ });
  }

  handle(source, session) {
    this._match(source, session);
    const data = {};
    session.machine.onBlankLine({ name: this.name, source, data }, session);
  }
};
