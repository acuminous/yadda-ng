const BaseState = require('./BaseState');
const { DocStringTokenEndEvent, EndEvent, DocStringEvent } = require('../events');
const events = [ EndEvent, DocStringTokenEndEvent, DocStringEvent ];

module.exports = class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocString(event) {
    this._specification.createBackgroundStepDocString({ ...event.data });
  }

  onDocStringTokenEnd(event) {
    this._machine.toCreateBackgroundStepState();
  }

};
