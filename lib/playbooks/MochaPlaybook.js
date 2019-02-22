const debug = require('debug')('yadda:playbooks:MochaPlaybook');
const os = require('os');
const FeaturePlaybook = require('./FeaturePlaybook');
const { ABORTED, PENDING, UNDEFINED, AMBIGUOUS, RUN, ERROR } = require('../steps/statuses');

module.exports = class MochaPlaybook extends FeaturePlaybook {
  constructor(props) {
    super(props);
    this._hooks = props.hooks || {};
  }

  async run() {
    const self = this;
    self.forEach((feature) => {
      self._addLifecycleHooks(self._hooks.featureLevel);
      debug(`describing feature: ${feature.title}`);
      self._describe(feature)(feature.title, function() {
        self._addLifecycleHooks(self._hooks.scenarioLevel);
        feature.forEach((scenario) => {
          debug(`describing scenario: ${scenario.title}`);
          self._describe(scenario)(scenario.title, function() {
            self._addLifecycleHooks(self._hooks.stepLevel);
            self._applyAnnotations(this, scenario);
            scenario.run((state) => {
              scenario.forEach((step) => {
                debug(`it step: ${step.text}`);
                self._it(step)(self._getStepDisplayText(step), async function() {
                  self._applyAnnotations(this, step);
                  const outcome = await step.run(state);
                  switch (outcome.status) {
                    case ABORTED: {
                      this.skip();
                      break;
                    }
                    case PENDING: {
                      this.skip();
                      break;
                    }
                    case AMBIGUOUS: {
                      scenario.abort();
                      throw new Error(`Ambiguous Step: [${step.text}] is equally matched by ${outcome.contenders.join(', ')}`);
                    }
                    case UNDEFINED: {
                      scenario.abort();
                      throw new Error(`Undefined Step: [${step.text}]\nSuggestion: ${outcome.suggestion}`);
                    }
                    case RUN: {
                      break;
                    }
                    case ERROR: {
                      scenario.abort();
                      throw outcome.error;
                    }
                    default: {
                      scenario.abort();
                      throw new Error(`Unrecognised outcome: [${outcome.status}]`);
                    }
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  _addLifecycleHooks(hooks = {}) {
    Object.keys(hooks).forEach((lifecycle) => {
      [].concat(hooks[lifecycle]).forEach((fn) => {
        debug(`adding lifecyle hook: [${lifecycle}]`);
        global[lifecycle](fn);
      });
    });
  }

  _describe(subject) {
    if (subject.isPending()) return global.xdescribe;
    if (subject.isExclusive()) return global.describe.only;
    return global.describe;
  }

  _it(subject) {
    if (subject.isPending()) return global.xit;
    if (subject.isExclusive()) return global.it.only;
    return global.it;
  }

  _applyAnnotations(test, subject) {
    if (subject.hasAnnotation('timeout')) {
      test.timeout(subject.getAnnotation('timeout').number);
    }
    if (subject.hasAnnotation('slow')) {
      test.slow(subject.getAnnotation('slow').number);
    }
  }

  _getStepDisplayText(step) {
    return step.docString ? `${step.text}${os.EOL}${os.EOL}${step.docString.replace(/^/gm, '          ')}${os.EOL}` : step.text;
  }
};
