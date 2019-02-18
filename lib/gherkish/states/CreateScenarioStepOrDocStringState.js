const BaseCreateStepState = require('./BaseCreateStepState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringTokenStartEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [ EndEvent, DocStringTokenStartEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent ];

module.exports = class CreateScenarioStepOrDocStringState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onDocStringTokenStart(event) {
    this._machine.toCreateScenarioStepDocStringState(event);
  }

  onEnd(event) {
    this._machine.toFinalState();
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioStepOrDocStringState();
  }
};
