const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateBackgroundStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ subject: 'background step', machine, specification });
  }

  onStep(event) {
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateBackgroundStepState();
  }
};
