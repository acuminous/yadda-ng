const BaseState = require('./BaseState');

module.exports = class FinalState extends BaseState {
  constructor({ machine }) {
    super({ machine });
  }
};
