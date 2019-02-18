const debug = require('debug')('yadda:gherkish:StateMachine');
const Specification = require('./Specification');
const {
  InitialState,
  CreateFeatureState,
  CreateBackgroundState,
  CreateBackgroundStepState,
  CreateBackgroundStepOrDocStringState,
  CreateBackgroundStepDocStringState,
  CreateScenarioState,
  CreateScenarioStepState,
  CreateScenarioStepOrDocStringState,
  CreateScenarioStepDocStringState,
  ConsumeMultiLineCommentState,
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

  toCreateBackgroundStepOrDocStringState() {
    this._to(new CreateBackgroundStepOrDocStringState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepDocStringState(event) {
    this._to(new CreateBackgroundStepDocStringState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioState() {
    this._to(new CreateScenarioState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioStepState() {
    this._to(new CreateScenarioStepState({ machine: this, specification: this._specification  }));
  }

  toCreateScenarioStepOrDocStringState() {
    this._to(new CreateScenarioStepOrDocStringState({ machine: this, specification: this._specification  }));
  }

  toCreateScenarioStepDocStringState(event) {
    this._to(new CreateScenarioStepDocStringState({ machine: this, specification: this._specification }));
  }

  toConsumeMultiLineCommentState() {
    this._to(new ConsumeMultiLineCommentState({ machine: this }));
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
