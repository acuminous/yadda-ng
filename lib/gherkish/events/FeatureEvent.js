const debug = require('debug')('yadda:gherkish:events:FeatureEvent');
const BaseVocabularyEvent = require('./BaseVocabularyEvent');

module.exports = class FeatureEvent extends BaseVocabularyEvent {

  constructor() {
    super({ vocabulary: 'feature' });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);
  }
};
