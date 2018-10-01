const BaseEvent = require('./BaseEvent');

module.exports = class DocstringEvent extends BaseEvent {

  constructor() {
    super({ name: 'docstring', regexp: /^\s*[-"]{3,}\s*$/ });
  }

  handle(source, session) {
    this._match(source, session);
    const data = {};
    session.machine.onDocString({ name: this.name, source, data }, session);
  }
};
