const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateScenarioStepDocStringState extends BaseCreateStepState {

  constructor({ machine, specification, indentation }) {
    super({ subject: 'step docstring', machine, specification, indentation });
  }

  onStep(event) {
    return !this.isIndented(event.source) ? this._onStep(event) : this._onDocString(event);
  }

  _onDocString(event) {
    const indentation = { ...this._indentation };
    const text = event.source.line.substring(indentation.docstring);
    this._specification.createScenarioStepDocString({ text });
    return this._machine.toCreateScenarioStepDocStringState({ indentation });
  }

  _onStep(event) {
    const indentation = { step: event.source.indentation };
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateScenarioStepState({ indentation });
  }
};
