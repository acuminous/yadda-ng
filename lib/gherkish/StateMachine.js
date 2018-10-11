const debug = require('debug')('yadda:gherkish:StateMachine');
const Specification = require('./Specification');
const {
  InitialState,
  CreateFeatureState,
  CreateBackgroundState,
  CreateBackgroundStepDocstringState,
  CreateBackgroundStepState,
  CreateScenarioState,
  CreateScenarioStepState,
  CreateScenarioStepDocstringState,
  CreateMultiLineCommentState,
  FinalState
} = require('./states');

module.exports = class StateMachine {

  constructor(props = {}) {
    this._specification = props.specification || new Specification();
    this._states = props.state ? [ props.state ] : [ new InitialState({ machine: this, specification: this._specification })];
  }

  get specification() {
    return this._specification;
  }

  get state() {
    return this._getCurrentState().name;
  }

  handle(source, session) {
    this._getCurrentState().handle(source, session);
  }

  toCreateFeatureState() {
    this._to(new CreateFeatureState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundState() {
    this._to(new CreateBackgroundState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepState() {
    this._to(new CreateBackgroundStepState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepDocstringState(event) {
    const token = event.data.token;
    const indentation = event.source.indentation;
    this._to(new CreateBackgroundStepDocstringState({ machine: this, specification: this._specification, token, indentation }));
  }

  toCreateScenarioState() {
    this._to(new CreateScenarioState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioStepState() {
    this._to(new CreateScenarioStepState({ machine: this, specification: this._specification  }));
  }

  toCreateScenarioStepDocstringState(event) {
    const token = event.data.token;
    const indentation = event.source.indentation;
    this._to(new CreateScenarioStepDocstringState({ machine: this, specification: this._specification, token, indentation }));
  }

  toCreateMultiLineCommentState() {
    this._to(new CreateMultiLineCommentState({ machine: this }));
  }

  toFinalState() {
    this._to(new FinalState({ machine: this, specification: this._specification }));
  }

  toPreviousState() {
    this._states.pop();
    const state = this._getCurrentState();
    debug(`Returning to state: ${state.name}`);
  }

  _getCurrentState() {
    return this._states[this._states.length - 1];
  }

  _to(state) {
    debug(`Transitioning to state: ${state.name}`);
    this._states.push(state);
  }
};
