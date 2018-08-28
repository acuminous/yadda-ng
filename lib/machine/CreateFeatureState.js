const BaseState = require('./BaseState');
const CreateBackgroundState = require('./CreateBackgroundState');
const CreateScenarioState = require('./CreateScenarioState');
const CreateCommentState = require('./CreateCommentState');

module.exports = class CreateFeatureState extends BaseState {

  constructor({ specification }) {
    super();
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ name: event.data.name, value: event.data.value });
    return this;
  }

  onBackground(event) {
    this._specification.createBackground({ annotations: this._annotations, title: event.data.title });
    return new CreateBackgroundState({ specification: this._specification });
  }

  onBlankLine(event) {
    return this;
  }

  onMultiLineComment(event) {
    return new CreateCommentState({ previousState: this });
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, title: event.data.title });
    return new CreateScenarioState({ specification: this._specification });
  }

  onSingleLineComment(event) {
    return this;
  }

  onText(event) {
    this._specification.describeFeature({ text: event.data.text });
    return this;
  }
};
