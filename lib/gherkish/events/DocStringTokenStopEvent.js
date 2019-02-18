const debug = require('debug')('yadda:gherkish:events:DocStringTokenStopEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class DocStringTokenStopEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*([-"]{3,})\s*$/ });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;
    const token = match[1];

    debug(`Testing session docString token: "${session.docString.token}" against ${token}`);
    if (token !== session.docString.token) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    session.indentation = 0;
    delete session.docString;
    state.onDocStringTokenEnd({ name: this.name, source, data: {} }, session);

    return true;
  }
};
