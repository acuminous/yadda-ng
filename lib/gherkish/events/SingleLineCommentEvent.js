const BaseEvent = require('./BaseEvent');

module.exports = class SingleLineCommentEvent extends BaseEvent {

  constructor() {
    super({ name: 'single_line_comment', regexp: /^\s*#\s*(.*)/ });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { text: match[1].trim() };
    session.machine.onSingleLineComment({ name: this.name, source, data }, session);
  }
};
