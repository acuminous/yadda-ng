const debug = require('debug')('yadda:gherkish:events:DocStringTokenEndEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringTokenEndEvent extends BaseEvent {

  constructor() {
    super({ name: 'DocStringTokenEnd', regexp: /^\s*([-"]{3,})\s*$/ });
  }

  handle(source, session, state) {
    const regexp = this._getRegexp(session);
    debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${regexp}`);

    const match = regexp.exec(source.line);
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
