const BaseEvent = require('./BaseEvent');

module.exports = class FeatureEvent extends BaseEvent {

  constructor() {
    super({ name: 'feature' });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { title: match[1].trim() };
    session.machine.onFeature({ name: this.name, source, data }, session);
  }
};
