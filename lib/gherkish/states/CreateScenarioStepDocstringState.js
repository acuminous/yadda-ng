const BaseState = require('./BaseState');
const { DocStringEndEvent, EndEvent, TextEvent } = require('../events');
const events = [ EndEvent, DocStringEndEvent, TextEvent ];

module.exports = class CreateScenarioStepDocStringState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocStringEnd(event) {
    this._machine.toCreateScenarioStepState();
  }

  onText(event) {
    this._specification.createScenarioStepDocString({ ...event.data });
  }

};
