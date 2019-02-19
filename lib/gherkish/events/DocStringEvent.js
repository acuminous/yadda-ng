const debug = require('debug')('yadda:gherkish:events:DocStringEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringEvent extends BaseEvent {

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    const data = { text: source.line.substr(session.docString.indentation) };
    state.onDocString({ name: this.name, source, data }, session);

    return true;
  }
};
