const Debug = require('debug');
const BaseEvent = require('./BaseEvent');

module.exports = class DocStringIndentStopEvent extends BaseEvent {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:gherkish:events:DocStringIndentStopEvent'),
    } = props;

    super({ debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString || session.docString.token) return false;
    if (source.indentation >= session.docString.indentation) return false;

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    delete session.docString;
    state.onDocStringIndentStop({ name: this.name, source, data: {} }, session);

    return true;
  }
};
