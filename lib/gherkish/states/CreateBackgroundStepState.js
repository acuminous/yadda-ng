const BaseCreateStepState = require('./BaseCreateStepState');

module.exports = class CreateBackgroundStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ subject: 'background step', machine, specification });
  }

  onDocstring(event) {
    this._machine.toCreateBackgroundStepDocstringState(event);
  }

  onStep(event) {
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundStepState();
  }
};
