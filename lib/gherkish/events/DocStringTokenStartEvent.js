const debug = require('debug')('yadda:gherkish:events:DocStringTokenStartEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringTokenStartEvent extends BaseEvent {

  constructor() {
    super({ name: 'DocStringTokenStart', regexp: /^\s*([-"]{3,})\s*$/ });
  }

  handle(source, session, state) {
    const regexp = this._getRegexp(session);
    debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${regexp}`);

    const match = regexp.exec(source.line);
    if (!match) return false;
    const token = match[1];

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    session.docString = { token };
    session.indentation = source.indentation;
    state.onDocStringTokenStart({ name: this.name, source, data: {} }, session);

    return true;
  }
};
