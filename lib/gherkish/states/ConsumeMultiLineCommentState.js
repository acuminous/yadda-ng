const BaseState = require('./BaseState');
const { EndEvent, MultiLineCommentEvent, TextEvent } = require('../events');
const events = [ EndEvent, MultiLineCommentEvent, TextEvent ];

module.exports = class ConsumeMultiLineCommentState extends BaseState {

  constructor({ machine }) {
    super({ machine, events });
  }

  onMultiLineComment(event) {
    this._machine.toPreviousState();
  }

  onText(event) {
  }
};
