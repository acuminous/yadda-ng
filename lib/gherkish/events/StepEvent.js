const BaseEvent = require('./BaseEvent');

module.exports = class StepEvent extends BaseEvent {

  constructor() {
    super({ name: 'step' });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { text: match[0].trim(), generalised: match[1].trim() };
    session.machine.onStep({ name: this.name, source, data }, session);
  }
};
