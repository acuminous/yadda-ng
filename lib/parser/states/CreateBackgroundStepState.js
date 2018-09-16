const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateBackgroundStepState extends BaseCreateStepState {

  constructor({ specification }) {
    super({ subject: 'background step', specification });
  }

  onStep(event) {
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    return new CreateBackgroundStepState({ specification: this._specification });
  }
};
