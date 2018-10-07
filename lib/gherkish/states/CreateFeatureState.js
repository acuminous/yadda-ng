const BaseState = require('./BaseState');

module.exports = class CreateFeatureState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBackground(event) {
    this._specification.createBackground({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundState();
  }

  onBlankLine(event) {
  }

  onMultiLineComment(event) {
    this._machine.toCreateMultiLineCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onSingleLineComment(event) {
  }

  onStep(event) {
    // Features don't support steps, so a description line must have matched the step pattern
    this._specification.describeFeature({ ...event.data });
  }

  onText(event) {
    this._specification.describeFeature({ ...event.data });
  }
};
