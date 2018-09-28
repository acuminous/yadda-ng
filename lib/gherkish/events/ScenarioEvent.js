const BaseEvent = require('./BaseEvent');

module.exports = class ScenarioEvent extends BaseEvent {

  constructor() {
    super({ name: 'scenario' });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { title: match[1].trim() };
    session.machine.onScenario({ name: this.name, source, data }, session);
  }
};
