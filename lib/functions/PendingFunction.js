// TODO - Add demand [arity] accessor which throws an error

module.exports = class PendingFunction {
  isPending() {
    return true;
  }

  async run() {
    throw new Error('Pending functions should not be executed');
  }
};
