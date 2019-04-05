const Debug = require('debug');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class TextEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:gherkish:events:TextEvent'),
    } = props;

    super({ regexp: /^(.*)$/, debug });
  }

  notify(source, session, state, match) {
    const data = { text: match[0] };
    state.onText({ name: this.name, source, data }, session);
  }
};
