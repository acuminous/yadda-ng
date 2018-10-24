const debug = require('debug')('yadda:gherkish:events:SingleLineCommentEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class SingleLineCommentEvent extends BaseEvent {

  constructor() {
    super({ regexp: /^\s*#\s*(.*)/ });
  }

  notify(source, session, state, match) {
    const data = { text: match[1].trim() };
    state.onSingleLineComment({ name: this.name, source, data }, session);
  }
};
