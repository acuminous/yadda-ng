const BaseCreateStepState = require('./BaseCreateStepState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringStartEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [ EndEvent, DocStringStartEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent ];

module.exports = class CreateBackgroundStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onDocStringStart(event) {
    this._machine.toCreateBackgroundStepDocStringState(event);
  }

  onStep(event) {
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundStepState();
  }
};
