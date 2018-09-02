const BaseState = require('./BaseState');

module.exports = class FinalState extends BaseState {
  constructor() {
    super({ subject: 'specification' });
  }
};
