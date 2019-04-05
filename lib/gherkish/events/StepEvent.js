const Debug = require('debug');
const BaseVocabularyEvent = require('./BaseVocabularyEvent');

module.exports = class StepEvent extends BaseVocabularyEvent {

  constructor(props = {}) {
    const {
      debug = Debug('yadda:gherkish:events:StepEvent'),
    } = props;

    super({ vocabulary: 'step', debug });
  }

  notify(source, session, state, match) {
    const data = {
      text: match[0].trim(),
      generalised: match[1] ? match[1].trim(): undefined,
    };
    session.indentation = source.indentation;
    state.onStep({ name: this.name, source, data }, session);
  }
};
