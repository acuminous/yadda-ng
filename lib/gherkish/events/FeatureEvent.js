const debug = require('debug')('yadda:gherkish:events:FeatureEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class FeatureEvent extends BaseEvent {

  constructor() {
    super({ name: 'feature' });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);
  }
};
