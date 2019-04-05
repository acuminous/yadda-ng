const Debug = require('debug');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class EndEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:gherkish:events:EndEvent'),
    } = props;

    super({ regexp: /^\u0000$/, debug });
  }

  notify(source, session, state, match) {
    state.onEnd({ name: this.name, source, data: {} }, session);
  }
};
