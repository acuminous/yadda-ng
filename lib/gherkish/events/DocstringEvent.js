const BaseEvent = require('./BaseEvent');

module.exports = class DocstringEvent extends BaseEvent {

  constructor() {
    super({ name: 'docstring', regexp: /^\s*([-"]{3,})\s*$/ });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { token: match[1] };
    session.machine.onDocstring({ name: this.name, source, data }, session);
  }
};
