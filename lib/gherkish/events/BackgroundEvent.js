const debug = require('debug')('yadda:gherkish:events:BackgroundEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class BackgroundEvent extends BaseEvent {

  constructor() {
    super({ vocabulary: 'background' });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onBackground({ name: this.name, source, data }, session);
  }
};
