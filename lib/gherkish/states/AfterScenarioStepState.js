const BaseStepState = require('./BaseStepState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent];

module.exports = class AfterScenarioStepState extends BaseStepState {
  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onDocStringIndentStart(event, session) {
    this._machine.toCreateScenarioStepDocStringState(event);
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStart(event) {
    this._machine.toCreateScenarioStepDocStringState(event);
  }

  onEnd(event) {
    this._machine.toFinalState();
  }

  onStep(event) {
    this._specification.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioStepState();
  }
};
