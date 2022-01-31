const Debug = require('debug');
const Section = require('./Section');

// The job of a Scenario is to house steps
module.exports = class Scenario extends Section {
  constructor(props) {
    const { annotations, title, steps, debug = Debug('yadda:Scenario') } = props;
    super({ annotations, title, iterables: steps, debug });

    this._aborted = false;
  }

  isAborted() {
    return this._abort();
  }

  abort() {
    this.forEach((step) => step.abort());
    this._aborted = true;
  }
};
