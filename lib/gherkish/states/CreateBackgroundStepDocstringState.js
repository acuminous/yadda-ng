const BaseState = require('./BaseState');
const { DocStringEndEvent, EndEvent, TextEvent } = require('../events');
const events = [ EndEvent, DocStringEndEvent, TextEvent ];

module.exports = class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, specification, token, indentation }) {
    super({ machine, specification, events });
    this._specification = specification;
    this._token = token;
    this._indentation = indentation;
  }

  onDocStringEnd(event) {
    this._machine.toCreateBackgroundStepState();
  }

  onText(event) {
    this._specification.createBackgroundStepDocString({ text: event.source.line.substr(this._indentation) });
  }
};
