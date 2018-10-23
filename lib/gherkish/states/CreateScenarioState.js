const BaseState = require('./BaseState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringTokenStartEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [ EndEvent, DocStringTokenStartEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent ];

module.exports = class CreateScenarioState extends BaseState {

  constructor({ machine, specification }) {
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

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioStepState();
  }
};
