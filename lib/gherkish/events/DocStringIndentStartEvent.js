const debug = require('debug')('yadda:gherkish:events:DocStringIndentStartEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringIndentStartEvent extends BaseEvent {

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (this._alreadyProcessingDocString(session) || this._notIndented(source, session)) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    session.docString = { indentation: source.indentation };
    state.onDocStringIndentStart({ name: this.name, source, data: {} }, session);

    return true;
  }

  _alreadyProcessingDocString(session) {
    return !!session.docString;
  }

  _notIndented(source, session) {
    return !(session.hasOwnProperty('indentation') && source.indentation > session.indentation);
  }
};
