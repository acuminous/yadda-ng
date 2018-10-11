const BaseState = require('./BaseState');

module.exports = class BaseCreateStepState extends BaseState {

  constructor({ machine, specification, events }) {
    super({ machine, events });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onMultiLineComment(event) {
    this._machine.toCreateMultiLineCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }
};
