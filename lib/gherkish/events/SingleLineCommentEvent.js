const debug = require('debug')('yadda:gherkish:events:SingleLineCommentEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class SingleLineCommentEvent extends BaseEvent {

  constructor() {
    super({ name: 'single_line_comment', regexp: /^\s*#\s*(.*)/ });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { text: match[1].trim() };
    state.onSingleLineComment({ name: this.name, source, data }, session);
  }
};
