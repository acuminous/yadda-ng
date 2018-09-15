const BaseState = require('./BaseState');
const CreateBackgroundState = require('./CreateBackgroundState');
const CreateScenarioState = require('./CreateScenarioState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateFeatureState extends BaseState {

  constructor({ specification }) {
    super({ subject: 'feature' });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
    return this;
  }

  onBackground(event) {
    this._specification.createBackground({ annotations: this._annotations, ...event.data });
    return new CreateBackgroundState({ specification: this._specification });
  }

  onBlankLine(event) {
    return this;
  }

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    return new CreateScenarioState({ specification: this._specification });
  }

  onSingleLineComment(event) {
    return this;
  }

  onStep(event) {
    // Features don't support steps, so a description line must have matched the step pattern
    this._specification.describeFeature({ text: event.data.text });
    return this;
  }

  onText(event) {
    this._specification.describeFeature({ ...event.data });
    return this;
  }
};
