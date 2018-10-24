const debug = require('debug')('yadda:gherkish:events:DocStringEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringEvent extends BaseEvent {

  constructor() {
    super({ regexp: /^(.*)$/ });
  }

  notify(source, session, state, match) {
    const data = { text: match[0].substr(session.indentation) };
    state.onDocString({ name: this.name, source, data }, session);
  }
};
