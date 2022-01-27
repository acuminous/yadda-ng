const BaseStepState = require('./BaseStepState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [EndEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent];

module.exports = class AfterScenarioStepDocStringState extends BaseStepState {
  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onEnd(event) {
    this._machine.toFinalState();
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioStepState();
  }
};
