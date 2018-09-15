const debug = require('debug')('yadda:arities:FixedArity');

module.exports = class FixedArity {
  constructor({ signature, type, demand }) {
    this._signature = signature;
    this._type = type;
  }

  validate(step, supply, demand) {
    if (supply === demand) return;
    throw new Error(`Step [${step.text}] yielded ${this._formatSupply(supply, demand)} using ${this._signature}, but ${this._formatDemand(supply, demand)} specified`);
  }

  _formatSupply(supply, demand) {
    const items = this._pluralise('value', 'values', supply, demand);
    if (supply === 0) return `no ${items}`;
    if (supply < demand) return `only ${supply} ${items}`;
    return `${supply} ${items}`;
  }

  _formatDemand(supply, demand) {
    const items = this._pluralise('argument was', 'arguments were', demand);
    if (demand === 0) return `no ${this._type} ${items}`;
    if (supply > demand) return `only ${demand} ${this._type} ${items}`;
    return `${demand} ${this._type} ${items}`;
  }

  _pluralise(singular, plural, count) {
    return count === 1 ? singular : plural;
  }
};
