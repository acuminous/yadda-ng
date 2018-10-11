const BaseCreateStepState = require('./BaseCreateStepState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocstringEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent } = require('../events');
const events = [ EndEvent, DocstringEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent ];

module.exports = class CreateBackgroundStepState extends BaseCreateStepState {

  constructor({ machine, specification }) {
    super({ machine, specification, events });
  }

  onDocstring(event) {
    this._machine.toCreateBackgroundStepDocstringState(event);
  }

  onStep(event) {
    this._specification.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundStepState();
  }
};
