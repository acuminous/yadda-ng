const BaseState = require('./BaseState');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringIndentStartEvent, DocStringIndentStopEvent,DocStringTokenStartEvent,DocStringTokenStopEvent,EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent, TextEvent } = require('../events');
const events = [ EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, TextEvent ];

module.exports = class CreateFeatureState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, events });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBackground(event) {
    this._specification.createBackground({ annotations: this._annotations, ...event.data });
    this._machine.toCreateBackgroundState();
  }

  onMultiLineComment(event) {
    this._machine.toConsumeMultiLineCommentState();
  }

  onScenario(event) {
    this._specification.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onText(event) {
    this._specification.describeFeature({ ...event.data });
  }
};
