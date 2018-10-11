const BaseState = require('./BaseState');
const Languages = require('./../languages');
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocstringEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, ScenarioEvent, SingleLineCommentEvent } = require('../events');
const events = [ EndEvent, DocstringEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent ];

module.exports = class InitialState extends BaseState {

  constructor({ machine, specification }) {
    super({ machine, events });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine(event) {
  }

  onFeature(event) {
    this._specification.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toCreateFeatureState();
  }

  onLanguage(event, session) {
    session.language = Languages.utils.get(event.data.name);
  }

  onMultiLineComment(event) {
    this._machine.toCreateMultiLineCommentState();
  }

  onSingleLineComment(event) {
  }
};
