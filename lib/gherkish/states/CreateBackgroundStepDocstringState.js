const BaseState = require('./BaseState');
const { DocstringEvent, EndEvent, TextEvent } = require('../events');
const events = [ EndEvent, DocstringEvent, TextEvent ];

module.exports = class CreateBackgroundStepDocStringState extends BaseState {

  constructor({ machine, specification, token, indentation }) {
    super({ machine, specification, events });
    this._specification = specification;
    this._token = token;
    this._indentation = indentation;
  }

  onText(event) {
    this._addDocstring(event.source.line);
  }

  onDocstring(event) {
    event.data.token === this._token
      ? this._machine.toCreateBackgroundStepState()
      : this._addDocstring(event.source.line);
  }

  _addDocstring(text) {
    this._specification.createBackgroundStepDocstring({ text: text.substr(this._indentation) });
  }
};
