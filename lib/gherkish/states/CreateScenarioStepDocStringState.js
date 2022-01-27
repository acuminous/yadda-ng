const BaseState = require('./BaseState');
const { DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, DocStringEvent } = require('../events');
const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, DocStringEvent];

module.exports = class CreateScenarioStepDocStringState extends BaseState {
  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocString(event) {
    this._specification.createScenarioStepDocString({ ...event.data });
  }

  onDocStringIndentStop(event, session) {
    this._machine.toAfterScenarioStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop(event) {
    this._machine.toAfterScenarioStepDocStringState();
  }
};
