const debug = require('debug')('yadda:gherkish:events:BaseEvent');

module.exports = class BaseEvent {

  constructor({ name, regexp }) {
    this._name = name;
    this._regexp = regexp;
  }

  get name() {
    return this._name;
  }

  test(source, session) {
    const regexp = this._getRegexp(session);
    debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${regexp}`);
    return regexp.test(source.line);
  }

  handle(source, session, state) {
    if (!this.test(source, session)) return false;

    debug(`Handing event: ${this._name} in state: ${state.name}`);
    this._handle(source, session, state);
    return true;
  }

  _getRegexp(session) {
    return session.language.regexp(this._name) || this._regexp;
  }

  _match(source, session) {
    const match = this._getRegexp(session).exec(source.line);
    if (!match) throw new Error(`text: ${source.line} did not match regexp ${this._regexp}`);
    return match;
  }

};