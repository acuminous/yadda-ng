const BaseState = require('./BaseState');
const { DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, DocStringEvent } = require('../events');
const events = [ EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, DocStringEvent ];

module.exports = class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocString(event) {
    this._specification.createBackgroundStepDocString({ ...event.data });
  }

  onDocStringIndentStop(event, session) {
    this._machine.toAfterBackgroundStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop(event) {
    this._machine.toAfterBackgroundStepDocStringState();
  }

};
