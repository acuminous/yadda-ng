const Debug = require('debug');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class BlankLineEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:BlankLineEvent') } = props;

    super({ regexp: /^\s*$/, debug });
  }

  notify(source, session, state, match) {
    state.onBlankLine({ name: this.name, source, data: {} }, session);
  }
};
