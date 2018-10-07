const BaseCreateStepDocstringState = require('./BaseCreateStepDocstringState');

module.exports = class CreateScenarioStepDocStringState extends BaseCreateStepDocstringState {

  _addDocstring(text) {
    this._specification.createScenarioStepDocstring({ text: text.substr(this._indentation) });
  }
};
