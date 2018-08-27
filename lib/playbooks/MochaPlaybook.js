const debug = require('debug')('yadda-ng:playbooks:MochaPlaybook');
const FeaturePlaybook = require('./FeaturePlaybook');
const { PENDING, UNDEFINED, AMBIGUOUS, RUN, ERROR } = require('../steps/statuses');

module.exports = class MochaPlaybook extends FeaturePlaybook {
  constructor(props) {
    super(props);
    this._hooks = props.hooks || {};
  }

  async run() {
    const self = this;
    self.forEach((feature) => {
      self._addLifecycleHooks(self._hooks.featureLevel);
      debug(`describing feature: [${feature.title}]`);
      self._describe(feature)(feature.title, function() {
        self._addLifecycleHooks(self._hooks.scenarioLevel);
        feature.forEach((scenario) => {
          debug(`describing scenario: [${scenario.title}]`);
          self._describe(scenario)(scenario.title, function() {
            self._addLifecycleHooks(self._hooks.stepLevel);
            self._applyAnnotations(this, scenario);
            scenario.run((state) => {
              scenario.forEach((step) => {
                debug(`it step: [${step.statement}]`);
                self._it(step)(step.statement, async function() {
                  self._applyAnnotations(this, step);
                  const outcome = await step.run(state);
                  switch (outcome.status) {
                    case PENDING: {
                      this.skip();
                      break;
                    }
                    case AMBIGUOUS: {
                      throw new Error(`Ambiguous Step: [${step.statement}] is equally matched by ${outcome.contenders.join(',')}`);
                    }
                    case UNDEFINED: {
                      throw new Error(`Undefined Step: [${step.statement}].\nSuggestion: ${outcome.suggestion}`);
                    }
                    case RUN: {
                      break;
                    }
                    case ERROR: {
                      throw outcome.error;
                    }
                    default: {
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
    return subject.isPending() ? global.xdescribe : global.describe;
  }

  _it(subject) {
    return subject.isPending() ? global.xit : global.it;
  }

  _applyAnnotations(test, subject) {
    if (subject.hasAnnotation('timeout')) {
      test.timeout(subject.getAnnotation('timeout').number);
    }
    if (subject.hasAnnotation('slow')) {
      test.slow(subject.getAnnotation('slow').number);
    }
  }

};
