const debug = require('debug')('yadda:gherkish:events:TextEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class TextEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^(.*)$/ });
  }

  notify(source, session, state, match) {
    const data = { text: match[0] };
    state.onText({ name: this.name, source, data }, session);
  }
};
