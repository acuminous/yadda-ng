const BaseEvent = require('./BaseEvent');

module.exports = class LanguageEvent extends BaseEvent {

  constructor() {
    super({ name: 'language', regexp: /^\s*#\s*language\s*:(.*)$/i });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { name: match[1].trim() };
    session.machine.onLanguage({ name: this.name, source, data }, session);
  }
};
