const debug = require('debug')('yadda:gherkish:events:DocStringTokenStartEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class DocStringTokenStartEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*([-"]{3,})\s*$/ });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;
    const token = match[1];

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    session.docString = { token };
    session.indentation = source.indentation;
    state.onDocStringTokenStart({ name: this.name, source, data: {} }, session);

    return true;
  }
};