const debug = require('debug')('yadda:gherkish:events:TextEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class TextEvent extends BaseEvent {

  constructor() {
    super({ name: 'text', regexp: /^(.*)$/ });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { text: match[0].trim() };
    state.onText({ name: this.name, source, data }, session);
  }
};
