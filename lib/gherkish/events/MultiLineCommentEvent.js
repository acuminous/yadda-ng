const BaseEvent = require('./BaseEvent');

module.exports = class MultiLineCommentEvent extends BaseEvent {

  constructor() {
    super({ name: 'multi_line_comment', regexp: /^\s*#{3,}\s*(.*)/ });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { text: match[1].trim() };
    session.machine.onMultiLineComment({ name: this.name, source, data }, session);
  }
};
