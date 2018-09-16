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

  handle(event, session) {
    this._getEventHandler(event.handler).handle(event, session);
  }

  toCreateFeatureState() {
    return this._to(new CreateFeatureState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundState() {
    return this._to(new CreateBackgroundState({ machine: this, specification: this._specification }));
  }

  toCreateBackgroundStepState({ indentation }) {
    return this._to(new CreateBackgroundStepState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateBackgroundStepDocStringState({ indentation }) {
    return this._to(new CreateBackgroundStepDocStringState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateScenarioState() {
    return this._to(new CreateScenarioState({ machine: this, specification: this._specification }));
  }

  toCreateScenarioStepState({ indentation }) {
    return this._to(new CreateScenarioStepState({ machine: this, specification: this._specification, indentation }));
  }

  toCreateScenarioStepDocStringState({ indentation }) {
    return this._to(new CreateScenarioStepDocStringState({ machine: this, specification: this._specification, indentation }));
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
        debug(`Handling event: ${event.name} in state: ${session.machine.state}`);
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
