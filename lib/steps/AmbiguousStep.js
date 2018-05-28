const debug = require('debug')('yadda-ng:steps:AmbiguousStep');
const BaseStep = require('./BaseStep');

module.exports = class AmbiguousStep extends BaseStep {
  constructor(props) {
    super(props);
    this._contenders = props.contenders;
  }

  run() {
    const signatures = this._contenders.map((contender) => String(contender)).join(', ');
    throw new Error(`Ambiguous Step: [${this._text}] is equally matched by [${signatures}]`);
  }
};
