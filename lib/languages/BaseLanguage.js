const debug = require('debug')('yadda-ng:localisation:Language');

module.exports = class Language {
  constructor({ name = this.constructor.name, vocabulary }) {
    this._name = name;
    this._regexp = {
      step: new RegExp(`^(?:${vocabulary.step.join('|')})\\s`, 'i'),
      feature: new RegExp(`^\\s*(?:${vocabulary.feature.join('|')})\\s*:\\s*(.*)`, 'i'),
      background: new RegExp(`^\\s*(?:${vocabulary.background.join('|')})\\s*:\\s*(.*)`, 'i'),
      scenario: new RegExp(`^\\s*(?:${vocabulary.scenario.join('|')})\\s*:\\s*(.*)`, 'i'),
    };
  }

  get name() {
    return this._name;
  }

  regexp(type) {
    return this._regexp[type];
  }

  generalise(statement) {
    debug(`generalising statement [${statement}] using language [${this._name}]}`);
    return statement.replace(this._regexp.step, '');
  }
};
