const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateScenarioStepState extends BaseCreateStepState {

  constructor({ specification }) {
    super({ subject: 'step', specification });
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    return new CreateScenarioStepState({ specification: this._specification });
  }
};
