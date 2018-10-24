const debug = require('debug')('yadda:gherkish:events:BaseEvent');
const BaseEvent = require('./BaseEvent');

module.exports = class BaseVocabularyEvent extends BaseEvent {

  constructor({ vocabulary }) {
    super();
    this._vocabulary = vocabulary;
  }

  _match(source, session) {
    const regexp = session.language.regexp(this._vocabulary);
    debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${regexp}`);
    return regexp.exec(source.line);
  }
};
