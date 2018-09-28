const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateScenarioStepDocStringState extends BaseCreateStepState {

  constructor({ machine, specification, indentation }) {
    super({ subject: 'step docstring', machine, specification, indentation });
  }

  onBlankLine(event) {
    if (this.isIndented(event.source)) this._onDocString(event);
  }

  onStep(event) {
    this.isIndented(event.source) ?  this._onDocString(event) : this._onStep(event);
  }

  _onDocString(event) {
    const indentation = { ...this._indentation };
    const text = event.source.line.substring(indentation.docstring);
    this._specification.createScenarioStepDocString({ text });
    this._machine.toCreateScenarioStepDocStringState({ indentation });
  }

  _onStep(event) {
    const indentation = { step: event.source.indentation };
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioStepState({ indentation });
  }
};
