const BaseState = require('./BaseState');
const { DocStringTokenStopEvent, EndEvent, DocStringEvent } = require('../events');
const events = [ EndEvent, DocStringTokenStopEvent, DocStringEvent ];

module.exports = class CreateScenarioStepDocStringState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocString(event) {
    this._specification.createScenarioStepDocString({ ...event.data });
  }

  onDocStringTokenEnd(event) {
    this._machine.toCreateScenarioStepState();
  }
};
