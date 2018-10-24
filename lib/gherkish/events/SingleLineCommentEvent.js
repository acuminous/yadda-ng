const debug = require('debug')('yadda:gherkish:events:SingleLineCommentEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class SingleLineCommentEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*#\s*(.*)/ });
  }

  notify(source, session, state, match) {
    const data = { text: match[1].trim() };
    state.onSingleLineComment({ name: this.name, source, data }, session);
  }
};
