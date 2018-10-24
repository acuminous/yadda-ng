const debug = require('debug')('yadda:gherkish:events:BaseRegExpEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class BaseRegExpEvent extends BaseEvent {

  constructor({ regexp }) {
    super();
    this._regexp = regexp;
  }

  _match(source, session) {
    debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${this._regexp}`);
    return this._regexp.exec(source.line);
  }
};
