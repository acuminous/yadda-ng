const debug = require('debug')('yadda:gherkish:SpecificationParser');
const Languages = require('./languages');
const Events = require('./events');
const StateMachine = require('./StateMachine');

module.exports = class SpecificationParser {

  static parse(text, session = {}) {
    session.machine = session.machine || new StateMachine();
    session.language = session.language || Languages.utils.getDefault();
    SpecificationParser._parseLines(text, session);
    return session.machine.specification.export();
  }

  static _parseLines(text, session) {
    text.split(/\n|\r\n/).concat('\u0000').forEach((line, index) => {
      const number = index + 1;
      const indentation =  line.match((/[^\s/]/)) ? line.search(/[^\s/]/) : line.length;
      SpecificationParser._parseLine({ line, number, indentation }, session);
    });
  }

  static _parseLine(source, session) {
    debug(`Parsing line ${source.number}: "${source.line}"`);
    const event = Events.utils.find(source, session);
    debug(`Found event: ${event.name}`);
    event.handle(source, session);
  }
};
