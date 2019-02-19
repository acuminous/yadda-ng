const debug = require('debug')('yadda:gherkish:events:BackgroundEvent');
const BaseVocabularyEvent = require('./BaseVocabularyEvent');

module.exports = class BackgroundEvent extends BaseVocabularyEvent {

  constructor() {
    super({ vocabulary: 'background' });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    delete session.indentation;
    state.onBackground({ name: this.name, source, data }, session);
  }
};
