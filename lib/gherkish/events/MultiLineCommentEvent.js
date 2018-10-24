const debug = require('debug')('yadda:gherkish:events:MultiLineCommentEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class MultiLineCommentEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*#{3,}\s*(.*)/ });
  }

  notify(source, session, state, match) {
    const data = { text: match[1].trim() };
    state.onMultiLineComment({ name: this.name, source, data }, session);
  }
};
