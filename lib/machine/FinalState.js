module.exports = class FinalState {

  get name() {
    return 'final';
  }

  handle(event) {
    switch(event.name) {
      default: {
        throw new Error(`Unexpected event: ${event.name} on line: ${event.source.number}, '${event.source.line}'`);
      }
    }
  }
};
