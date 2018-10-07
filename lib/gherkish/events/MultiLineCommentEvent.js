const debug = require('debug')('yadda:gherkish:events:MultiLineCommentEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class MultiLineCommentEvent extends BaseEvent {

  constructor() {
    super({ name: 'multi_line_comment', regexp: /^\s*#{3,}\s*(.*)/ });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { text: match[1].trim() };
    state.onMultiLineComment({ name: this.name, source, data }, session);
  }
};
