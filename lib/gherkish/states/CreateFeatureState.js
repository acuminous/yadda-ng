const BaseState = require('./BaseState');

module.exports = class CreateFeatureState extends BaseState {

  constructor({ machine, specification }) {
    super({ subject: 'feature', machine });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
    return this;
  }

  onBackground(event) {
    this._specification.createBackground({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateBackgroundState();
  }

  onBlankLine(event) {
    return this;
  }

  onMultiLineComment(event) {
    return this._machine.toCreateCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    return this._machine.toCreateScenarioState();
  }

  onSingleLineComment(event) {
    return this;
  }

  onStep(event) {
    // Features don't support steps, so a description line must have matched the step pattern
    this._specification.describeFeature({ ...event.data });
    return this;
  }

  onText(event) {
    this._specification.describeFeature({ ...event.data });
    return this;
  }
};
