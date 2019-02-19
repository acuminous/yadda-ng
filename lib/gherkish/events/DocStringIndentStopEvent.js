const debug = require('debug')('yadda:gherkish:events:DocStringIndentStopEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringIndentStopEvent extends BaseEvent {

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString || session.docString.token) return false;
    if (source.indentation >= session.docString.indentation) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    delete session.docString;
    state.onDocStringIndentStop({ name: this.name, source, data: {} }, session);

    return true;
  }
};
