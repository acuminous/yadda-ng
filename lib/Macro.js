const Debug = require('debug');
const { MultiConverter } = require('./converters');
const { FixedArity } = require('./arities');

module.exports = class Macro {
  constructor(props) {
    const { signature, converters, fn, debug = Debug('yadda:Macro') } = props;

    this._signature = signature;
    this._converters = new MultiConverter({ converters: converters });
    this._converterArity = new FixedArity({ type: 'converter', signature });
    this._functionArity = new FixedArity({ type: 'step', signature });
    this._fn = fn;
    this._debug = debug;
  }

  supports(step) {
    return this._signature.supports(step);
  }

  isPending() {
    return this._fn.isPending();
  }

  setCurrentLibrary(state) {
    this._signature.setCurrentLibrary(state);
  }

  isFromLibrary(name) {
    return this._signature.isFromLibrary(name);
  }

  reportDuplicate(other) {
    return this._signature.reportDuplicate(other);
  }

  async run(state, step) {
    const args = await this._getArguments(state, step);
    return this._callFunction(state, step, args);
  }

  async _getArguments(state, step) {
    const args = step.docString ? this._signature.parseArguments(step).concat(step.docString) : this._signature.parseArguments(step);
    this._converterArity.validate(step, args.length, this._converters.demand);
    return this._converters.convert(state, args);
  }

  async _callFunction(state, step, args) {
    this._functionArity.validate(step, args.length, this._fn.demand);
    return this._fn.run(state, args);
  }

  toString() {
    return this._signature.toString();
  }
};
