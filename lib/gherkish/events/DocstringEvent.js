const debug = require('debug')('yadda:gherkish:events:DocstringEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocstringEvent extends BaseEvent {

  constructor() {
    super({ name: 'docstring', regexp: /^\s*([-"]{3,})\s*$/ });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { token: match[1] };
    state.onDocstring({ name: this.name, source, data }, session);
  }
};
