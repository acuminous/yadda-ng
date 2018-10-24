const debug = require('debug')('yadda:gherkish:events:StepEvent');
const BaseVocabularyEvent = require('./BaseVocabularyEvent');

module.exports = class StepEvent extends BaseVocabularyEvent {

  constructor() {
    super({ vocabulary: 'step' });
  }

  notify(source, session, state, match) {
    const data = { text: match[0].trim(), generalised: match[1] ? match[1].trim(): undefined };
    state.onStep({ name: this.name, source, data }, session);
  }
};
