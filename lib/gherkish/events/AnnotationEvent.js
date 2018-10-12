const debug = require('debug')('yadda:gherkish:events:AnnotationEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class AnnotationEvent extends BaseEvent {

  constructor() {
    super({ name: 'annotation', regexp: /^\s*@([^=]*)(?:=(.*))?$/ });
  }

  _handle(source, session, state) {
    const match = this._match(source, session);
    const data = { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
    state.onAnnotation({ name: this.name, source, data }, session);
  }
};