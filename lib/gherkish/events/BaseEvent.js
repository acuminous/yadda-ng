const debug = require('debug')('yadda:gherkish:events:BaseEvent');

module.exports = class BaseEvent {

  constructor() {
    this._name = this.constructor.name;
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
};
