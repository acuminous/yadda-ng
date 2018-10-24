const debug = require('debug')('yadda:gherkish:events:FeatureEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class FeatureEvent extends BaseEvent {

  constructor() {
    super({ vocabulary: 'feature' });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);
  }
};
