const debug = require('debug')('yadda:gherkish:events:BaseEvent');

module.exports = class BaseEvent {

  constructor(props = {}) {
    this._name = props.name || this.constructor.name;
    this._vocabulary = props.vocabulary;
    this._regexp = props.regexp;
  }

  get name() {
    return this._name;
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    this.notify(source, session, state, match);

    return true;
  }

  _match(source, session) {
    const regexp = this._getRegexp(session);
    debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${regexp}`);
    return regexp.exec(source.line);
  }

  _getRegexp(session) {
    return this._vocabulary
      ? session.language.regexp(this._vocabulary)
      : this._regexp;
  }
};
