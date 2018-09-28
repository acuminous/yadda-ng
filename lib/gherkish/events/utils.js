const debug = require('debug')('yadda:Events:utils');

const AnnotationEvent = require('./AnnotationEvent');
const BackgroundEvent = require('./BackgroundEvent');
const BlankLineEvent = require('./BlankLineEvent');
const EndEvent = require('./EndEvent');
const FeatureEvent = require('./FeatureEvent');
const LanguageEvent = require('./LanguageEvent');
const MultiLineCommentEvent = require('./MultiLineCommentEvent');
const ScenarioEvent = require('./ScenarioEvent');
const SingleLineCommentEvent = require('./SingleLineCommentEvent');
const StepEvent = require('./StepEvent');
const TextEvent = require('./TextEvent');

const events = [
  new EndEvent(),
  new LanguageEvent(),
  new AnnotationEvent(),
  new FeatureEvent(),
  new BackgroundEvent(),
  new ScenarioEvent(),
  new BlankLineEvent(),
  new MultiLineCommentEvent(),
  new SingleLineCommentEvent(),
  new StepEvent(),
  new TextEvent(),
];

function find(source, session) {
  return events.find((event) => event.test(source, session));
}

module.exports = {
  find,
};
