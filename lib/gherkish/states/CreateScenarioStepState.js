const BaseCreateStepState = require('./BaseCreateStepState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [ EndEvent, DocStringEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent ];

module.exports = class CreateScenarioStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onDocString(event) {
    this._machine.toCreateScenarioStepDocStringState(event);
  }

  onEnd(event) {
    this._machine.toFinalState();
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioStepState();
  }
};
