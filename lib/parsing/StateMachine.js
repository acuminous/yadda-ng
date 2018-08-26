const InitialState = require('./states/InitialState');

module.exports = class StateMachine {

  constructor({ specificationBuilder }) {
    this._specificationBuilder = specificationBuilder;
    this._state = new InitialState({ specificationBuilder });
  }

  get state() {
    return this._state.name;
  }

  handle(event) {
    this._state = this._state.handle(event);
  }
};
