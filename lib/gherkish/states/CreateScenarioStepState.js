const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateScenarioStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ subject: 'step', machine, specification });
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateScenarioStepState();
  }
};
