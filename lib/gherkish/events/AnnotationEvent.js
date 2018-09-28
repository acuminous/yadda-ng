const BaseEvent = require('./BaseEvent');

module.exports = class ValuedAnnotationEvent extends BaseEvent {

  constructor() {
    super({ name: 'annotation', regexp: /^\s*@([^=]*)(?:=(.*))?$/ });
  }

  handle(source, session) {
    const match = this._match(source, session);
    const data = { name: match[1].trim(), value: match[2] ? match[2].trim() : true };
    session.machine.onAnnotation({ name: this.name, source, data }, session);
  }
};
