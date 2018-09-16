const debug = require('debug')('yadda:gherkish:StateMachine');
const Specification = require('./Specification');
const {
  InitialState,
  CreateFeatureState,
  CreateBackgroundState,
  CreateBackgroundStepState,
  CreateScenarioState,
  CreateScenarioStepState,
  CreateCommentState,
  FinalState
} = require('./states');

module.exports = class StateMachine {

  constructor({ parser, specification = new Specification(), state }) {
    this._parser = parser;
    this._specification = specification;
    this._states = state ? [ state ] : [ new InitialState({ machine: this, parser, specification })];
  }

  get specification() {
    return this._specification;
  }

  get state() {
    return this._getCurrentState().name;
  }

  handle(event, session) {
    this._getEventHandler(event.handler).handle(event, session);
  }

  toCreateFeatureState() {
    return this._to(new CreateFeatureState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundState() {
    return this._to(new CreateBackgroundState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepState() {
    return this._to(new CreateBackgroundStepState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioState() {
    return this._to(new CreateScenarioState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioStepState() {
    return this._to(new CreateScenarioStepState({ machine: this, specification: this._specification }));
  }

  toCreateCommentState() {
    return this._to(new CreateCommentState({ machine: this }));
  }

  toFinalState() {
    return this._to(new FinalState({ machine: this, specification: this._specification }));
  }

  toPreviousState() {
    this._states.pop();
    const state = this._getCurrentState();
    debug(`Returning to state: ${state.name}`);
    return state;
  }

  _getCurrentState() {
    return this._states[this._states.length - 1];
  }

  _getEventHandler(handler) {
    return {
      handle: (event, session) => {
        const state = this._getCurrentState();
        state[event.handler](event, session);
      }
    };
  }

  _to(state) {
    debug(`Transitioning to state: ${state.name}`);
    this._states.push(state);
    return state;
  }
};
