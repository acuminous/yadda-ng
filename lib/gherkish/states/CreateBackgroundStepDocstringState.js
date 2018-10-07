const BaseCreateStepDocstringState = require('./BaseCreateStepDocstringState');

module.exports = class CreateBackgroundStepDocStringState extends BaseCreateStepDocstringState {

  _addDocstring(text) {
    this._specification.createBackgroundStepDocstring({ text: text.substr(this._indentation) });
  }
};
