const debug = require('debug')('yadda:gherkish:events:LanguageEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class LanguageEvent extends BaseEvent {

  constructor() {
    super({ name: 'language', regexp: /^\s*#\s*language\s*:(.*)$/i });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { name: match[1].trim() };
    state.onLanguage({ name: this.name, source, data }, session);
  }
};
