const Debug = require('debug');
const BaseRegExpEvent = require('./BaseRegExpEvent');

module.exports = class AnnotationEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:AnnotationEvent') } = props;

    super({ regexp: /^\s*@([^=]*)(?:=(.*))?$/, debug });
  }

  notify(source, session, state, match) {
    const data = { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
    state.onAnnotation({ name: this.name, source, data }, session);
  }
};
