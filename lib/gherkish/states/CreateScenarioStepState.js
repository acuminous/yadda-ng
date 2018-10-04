const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateScenarioStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ subject: 'step', machine, specification });
  }

  onDocstring(event) {
    this._machine.toCreateScenarioStepDocstringState(event);
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioStepState();
  }
};
