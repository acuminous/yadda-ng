const debug = require('debug')('yadda:gherkish:events:BlankLineEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class BlankLineEvent extends BaseEvent {

  constructor() {
    super({ name: 'blank_line', regexp: /^\s*$/ });
  }

  notify(source, session, state, match) {
    state.onBlankLine({ name: this.name, source, data: {} }, session);
  }
};
