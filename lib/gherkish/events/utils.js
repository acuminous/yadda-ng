const debug = require('debug')('yadda:gherkish:Events:utils');

const AnnotationEvent = require('./AnnotationEvent');
const BackgroundEvent = require('./BackgroundEvent');
const BlankLineEvent = require('./BlankLineEvent');
const DocstringEvent = require('./DocstringEvent');
const EndEvent = require('./EndEvent');
const FeatureEvent = require('./FeatureEvent');
const LanguageEvent = require('./LanguageEvent');
const MultiLineCommentEvent = require('./MultiLineCommentEvent');
const ScenarioEvent = require('./ScenarioEvent');
const SingleLineCommentEvent = require('./SingleLineCommentEvent');
const StepEvent = require('./StepEvent');
const TextEvent = require('./TextEvent');

// Order is important
const events = [
  new EndEvent(),
  new DocstringEvent(),
  new LanguageEvent(),
  new MultiLineCommentEvent(),
  new SingleLineCommentEvent(),
  new AnnotationEvent(),
  new FeatureEvent(),
  new BackgroundEvent(),
  new ScenarioEvent(),
  new BlankLineEvent(),
  new StepEvent(),
  new TextEvent(),
];

function find(source, session) {
  return events.find((event) => event.test(source, session));
}

module.exports = {
  find,
};
