const Debug = require('debug');
const BaseVocabularyEvent = require('./BaseVocabularyEvent');

module.exports = class FeatureEvent extends BaseVocabularyEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:FeatureEvent') } = props;

    super({ vocabulary: 'feature', debug });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);
  }
};
