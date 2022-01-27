const BaseState = require('./BaseState');
const Languages = require('./../languages');
const { AnnotationEvent, BlankLineEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent } = require('../events');
const events = [EndEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BlankLineEvent];

module.exports = class InitialState extends BaseState {
  constructor({ machine, specification }) {
    super({ machine, events });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine(event) {}

  onFeature(event) {
    this._specification.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toCreateFeatureState();
  }

  onLanguage(event, session) {
    session.language = Languages.utils.get(event.data.name);
  }

  onMultiLineComment(event) {
    this._machine.toConsumeMultiLineCommentState();
  }

  onSingleLineComment(event) {}
};
