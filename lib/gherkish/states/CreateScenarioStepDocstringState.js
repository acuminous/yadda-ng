const BaseState = require('./BaseState');
const { DocStringEvent, EndEvent, TextEvent } = require('../events');
const events = [ EndEvent, DocStringEvent, TextEvent ];

module.exports = class CreateScenarioStepDocStringState extends BaseState {

  constructor({ machine, specification, token, indentation }) {
    super({ machine, specification, events });
    this._specification = specification;
    this._token = token;
    this._indentation = indentation;
  }

  onText(event) {
    this._addDocString(event.source.line);
  }

  onDocString(event) {
    event.data.token === this._token
      ? this._machine.toCreateScenarioStepState()
      : this._addDocString(event.source.line);
  }

  _addDocString(text) {
    this._specification.createScenarioStepDocString({ text: text.substr(this._indentation) });
  }
};
