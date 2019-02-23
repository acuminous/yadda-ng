const debug = require('debug')('yadda:playbooks:MochaPlaybook');
const os = require('os');
const FeaturePlaybook = require('./FeaturePlaybook');
const State = require('../State');
const { ABORTED, PENDING, UNDEFINED, AMBIGUOUS, RUN, ERROR } = require('../steps/statuses');

module.exports = class MochaPlaybook extends FeaturePlaybook {
  constructor(props) {
    super(props);
    this._hooks = props.hooks || {};
  }

  async run(state = new State()) {
    const self = this;
    self.forEach((feature) => {
      debug(`describing feature: ${feature.title}`);
      self._describe(feature)(feature.title, function() {
        self._addFeatureLifeCycleHooks(state, feature, self._hooks.feature);
        feature.forEach((scenario) => {
          debug(`describing scenario: ${scenario.title}`);
          self._describe(scenario)(scenario.title, function() {
            self._applyAnnotations(this, scenario);
            self._addScenarioLifeCycleHooks(state, scenario, self._hooks.scenario);
            scenario.forEach((step) => {
              debug(`it step: ${step.text}`);
              self._addStepLifeCycleHooks(state, step);
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
  }

  _addFeatureLifeCycleHooks(state, feature, hooks = {}) {
    global.before(() => {
      state.clear(State.FEATURE_SCOPE);
      state.set('feature', feature, State.RESERVED_SCOPE);
    });
    global.after(() => {
      state.remove('feature', State.RESERVED_SCOPE);
    });
    this._addLifeCycleHooks('feature', state, hooks);
  }

  _addScenarioLifeCycleHooks(state, scenario, hooks = {}) {
    global.before(() => {
      state.clear(State.SCENARIO_SCOPE);
      state.set('scenario', scenario, State.RESERVED_SCOPE);
    });
    global.after(() => {
      state.remove('scenario', State.RESERVED_SCOPE);
    });
    this._addLifeCycleHooks('scenario', state, hooks);
  }

  _addStepLifeCycleHooks(state, step) {
    global.beforeEach(() => {
      state.set('step', step, State.RESERVED_SCOPE);
    });
    global.afterEach(() => {
      state.remove('step', State.RESERVED_SCOPE);
    });
  }

  _addLifeCycleHooks(level, state, hooks = {}) {
    Object.keys(hooks).forEach((lifeCycle) => {
      [].concat(hooks[lifeCycle]).forEach((fn) => {
        debug(`Adding ${level} life cycle hook: [${lifeCycle}]`);
        global[lifeCycle](fn.bind(null, state));
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
