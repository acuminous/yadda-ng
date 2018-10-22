const BaseState = require('./BaseState');
const { DocStringEndEvent, EndEvent, TextEvent } = require('../events');
const events = [ EndEvent, DocStringEndEvent, TextEvent ];

module.exports = class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocStringEnd(event) {
    this._machine.toCreateBackgroundStepState();
  }

  onText(event) {
    this._specification.createBackgroundStepDocString({ ...event.data });
  }
};
