const Debug = require('debug');

module.exports = class State {
  constructor(props = {}) {
    const { debug = Debug('yadda:State') } = props;

    this._scopes = {
      [State.RESERVED_SCOPE]: {},
      [State.PLAYBOOK_SCOPE]: {},
      [State.FEATURE_SCOPE]: {},
      [State.SCENARIO_SCOPE]: {},
    };
    this._debug = debug;
  }

  static get RESERVED_SCOPE() {
    return 'reserved';
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

  get feature() {
    return this.get('feature', State.RESERVED_SCOPE);
  }

  get scenario() {
    return this.get('scenario', State.RESERVED_SCOPE);
  }

  get state() {
    return this.get('state', State.RESERVED_SCOPE);
  }

  get(name, scope = State.SCENARIO_SCOPE) {
    this._debug(`Getting ${name} from ${scope} scope`);
    this._checkScope(scope);
    return this._scopes[scope][name];
  }

  set(name, value, scope = State.SCENARIO_SCOPE) {
    this._debug(`Writing ${name} to ${scope} scope`);
    this._checkScope(scope);
    this._scopes[scope][name] = value;
  }

  remove(name, scope = State.SCENARIO_SCOPE) {
    this._debug(`Removing ${name} from ${scope} scope`);
    this._checkScope(scope);
    delete this._scopes[scope][name];
  }

  clear(...scopes) {
    const doomed = scopes.length ? scopes : Object.keys(this._scopes);
    doomed.forEach((scope) => {
      this._debug(`Clearing ${scope} scope`);
      this._checkScope(scope);
      this._scopes[scope] = {};
    });
  }

  _checkScope(scope) {
    if (!Object.keys(this._scopes).find((s) => s === scope)) throw new Error(`Invalid scope: ${scope}`);
  }
};
