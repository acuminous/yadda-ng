const debug = require('debug')('yadda:gherkish:events:StepEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class StepEvent extends BaseEvent {

  constructor() {
    super({ name: 'step' });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { text: match[0].trim(), generalised: match[1].trim() };
    state.onStep({ name: this.name, source, data }, session);
  }
};
