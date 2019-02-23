const debug = require('debug')('yadda:State');

module.exports = class State {

  constructor() {
    this._scopes = {
      [State.PLAYBOOK_SCOPE]: {},
      [State.FEATURE_SCOPE]: {},
      [State.SCENARIO_SCOPE]: {},
    };
  }

  static get PLAYBOOK_SCOPE() {
    return 'playbook';
  }

  static get FEATURE_SCOPE() {
    return 'feature';
  }

  static get SCENARIO_SCOPE() {
    return 'scenario';
  }

  get(name, scope = State.SCENARIO_SCOPE) {
    this._checkScope(scope);
    return this._scopes[scope][name];
  }

  set(name, value, scope = State.SCENARIO_SCOPE) {
    this._checkScope(scope);
    this._scopes[scope][name] = value;
  }

  remove(name, scope = State.SCENARIO_SCOPE) {
    this._checkScope(scope);
    delete this._scopes[scope][name];
  }

  clear(...scopes) {
    const doomed = scopes.length ? scopes : Object.keys(this._scopes);
    doomed.forEach(scope => {
      this._checkScope(scope);
      this._scopes[scope] = {};
    });
  }

  _checkScope(scope) {
    if (!Object.keys(this._scopes).find(s => s === scope)) throw new Error(`Invalid scope: ${scope}`);
  }
};
