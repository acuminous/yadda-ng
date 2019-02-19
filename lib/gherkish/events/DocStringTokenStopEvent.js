const debug = require('debug')('yadda:gherkish:events:DocStringTokenStopEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class DocStringTokenStopEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*([-"]{3,})\s*$/ });
  }

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString || !session.docString.token) return false;

    const match = this._match(source, session);
    if (!match) return false;
    const token = match[1];

    debug(`Testing session docString token: "${session.docString.token}" against ${token}`);
    if (token !== session.docString.token) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    delete session.docString;
    state.onDocStringTokenStop({ name: this.name, source, data: {} }, session);

    return true;
  }
};
