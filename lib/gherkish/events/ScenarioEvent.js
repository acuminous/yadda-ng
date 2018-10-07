const debug = require('debug')('yadda:gherkish:events:ScenarioEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class ScenarioEvent extends BaseEvent {

  constructor() {
    super({ name: 'scenario' });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { title: match[1].trim() };
    state.onScenario({ name: this.name, source, data }, session);
  }
};
