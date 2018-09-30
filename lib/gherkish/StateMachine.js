const debug = require('debug')('yadda:gherkish:StateMachine');
const Specification = require('./Specification');
const {
  InitialState,
  CreateFeatureState,
  CreateBackgroundState,
  CreateBackgroundStepState,
  CreateBackgroundStepDocStringState,
  CreateScenarioState,
  CreateScenarioStepState,
  CreateScenarioStepDocStringState,
  CreateCommentState,
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

  onAnnotation(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onAnnotation(event, session);
  }

  onBackground(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onBackground(event, session);
  }

  onBlankLine(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onBlankLine(event, session);
  }

  onEnd(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onEnd(event, session);
  }

  onFeature(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onFeature(event, session);
  }

  onLanguage(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onLanguage(event, session);
  }

  onMultiLineComment(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onMultiLineComment(event, session);
  }

  onScenario(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onScenario(event, session);
  }

  onSingleLineComment(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onSingleLineComment(event, session);
  }

  onStep(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onStep(event, session);
  }

  onText(event, session) {
    const state = this._getCurrentState();
    debug(`Handling event: ${event.name} in state: ${state.name}`);
    state.onText(event, session);
  }

  toCreateFeatureState() {
    this._to(new CreateFeatureState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundState() {
    this._to(new CreateBackgroundState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepState({ indentation }) {
    this._to(new CreateBackgroundStepState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateBackgroundStepDocStringState({ indentation }) {
    this._to(new CreateBackgroundStepDocStringState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateScenarioState() {
    this._to(new CreateScenarioState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioStepState({ indentation }) {
    this._to(new CreateScenarioStepState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateScenarioStepDocStringState({ indentation }) {
    this._to(new CreateScenarioStepDocStringState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateCommentState() {
    this._to(new CreateCommentState({ machine: this }));
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
