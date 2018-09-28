const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateBackgroundStepDocStringState extends BaseCreateStepState {

  constructor({ machine, specification, indentation }) {
    super({ subject: 'background step docstring', machine, specification, indentation });
  }

  onBlankLine(event) {
    if (this.isIndented(event.source)) this._onDocString(event);
  }

  onStep(event) {
    this.isIndented(event.source) ? this._onDocString(event) : this._onStep(event);
  }

  _onDocString(event) {
    const indentation = { ...this._indentation };
    const text = event.source.line.substring(indentation.docstring);
    this._specification.createBackgroundStepDocString({ text });
    this._machine.toCreateBackgroundStepDocStringState({ indentation });
  }

  _onStep(event) {
    const indentation = { step: event.source.indentation };
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundStepState({ indentation });
  }
};
