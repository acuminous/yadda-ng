const debug = require('debug')('yadda:gherkish:events:DocStringEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringEvent extends BaseEvent {

  constructor() {
    super({ name: 'DocString', regexp: /^\s*([-"]{3,})\s*$/ });
  }

  notify(source, session, state, match) {
    const data = { token: match[1] };
    state.onDocString({ name: this.name, source, data }, session);
  }
};
