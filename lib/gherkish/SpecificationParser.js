const debug = require('debug')('yadda:gherkish:SpecificationParser');
const Languages = require('./languages');
const StateMachine = require('./StateMachine');

const lineBreak = /\n|\r\n/;
const nullChar = '\u0000';
const nonSpace = /[^\s]/;

module.exports = class SpecificationParser {

  parse(text, session = {}) {
    session.machine = session.machine || new StateMachine();
    session.language = session.language || Languages.utils.getDefault();
    session.indentation = session.indentation || 0;
    this._parseLines(text, session);
    return session.machine.specification.serialize();
  }

  _parseLines(text, session) {
    text.split(lineBreak).concat(nullChar).forEach((line, index) => {
      const number = index + 1;
      const indentation = nonSpace.test(line) ? line.search(nonSpace) : line.length;
      this._parseLine({ line, number, indentation }, session);
    });
  }

  _parseLine(source, session) {
    debug(`Parsing line ${source.number}: "${source.line}"`);
    session.machine.handle(source, session);
  }
};
