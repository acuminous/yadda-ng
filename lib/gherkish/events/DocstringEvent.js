const debug = require('debug')('yadda:gherkish:events:DocstringEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocstringEvent extends BaseEvent {

  constructor() {
    super({ name: 'docstring', regexp: /^\s*([-"]{3,})\s*$/ });
  }

  notify(source, session, state, match) {
    const data = { token: match[1] };
    state.onDocstring({ name: this.name, source, data }, session);
  }
};
