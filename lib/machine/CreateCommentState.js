const BaseState = require('./BaseState');

module.exports = class CreateCommentState extends BaseState {

  constructor({ previousState }) {
    super();
    this._previousState = previousState;
  }

  onMultiLineComment(event) {
    return this._previousState;
  }

  handleUnexpectedEvent(event) {
    return this;
  }
};
