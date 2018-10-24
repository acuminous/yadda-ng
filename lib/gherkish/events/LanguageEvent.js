const debug = require('debug')('yadda:gherkish:events:LanguageEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class LanguageEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*#\s*language\s*:(.*)$/i });
  }

  notify(source, session, state, match) {
    const data = { name: match[1].trim() };
    state.onLanguage({ name: this.name, source, data }, session);
  }
};
