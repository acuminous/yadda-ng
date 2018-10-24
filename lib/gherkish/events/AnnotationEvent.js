const debug = require('debug')('yadda:gherkish:events:AnnotationEvent');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class AnnotationEvent extends BaseRegExpEvent {

  constructor() {
    super({ regexp: /^\s*@([^=]*)(?:=(.*))?$/ });
  }

  notify(source, session, state, match) {
    const data = { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
    state.onAnnotation({ name: this.name, source, data }, session);
  }
};
