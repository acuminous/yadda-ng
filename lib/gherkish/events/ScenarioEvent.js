const debug = require('debug')('yadda:gherkish:events:ScenarioEvent');
const BaseVocabularyEvent = require('./BaseVocabularyEvent');

module.exports = class ScenarioEvent extends BaseVocabularyEvent {

  constructor() {
    super({ vocabulary: 'scenario' });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onScenario({ name: this.name, source, data }, session);
  }
};
