const debug = require('debug')('yadda:gherkish:events:BackgroundEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class BackgroundEvent extends BaseEvent {

  constructor() {
    super({ name: 'background' });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { title: match[1].trim() };
    state.onBackground({ name: this.name, source, data }, session);
  }
};
