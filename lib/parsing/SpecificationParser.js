const debug = require('debug')('yadda-ng:parsing:SpecificationParser');

module.exports = class SpecificationParser {

  constructor({ handler }) {
    this._handler = handler;
  }

  parse(text) {
    text.split(/\n|\r\n/).forEach((line, index) => this._parseLine(line, index + 1));
    this._handler.handle({ name: 'end' });
    return this._handler.export();
  }

  _parseLine(line, number) {
    [
      this._createEmitter('annotation', /^\s*@([^=]*)$/, (match) => ({ name: match[1].trim(), value: true })),
      this._createEmitter('annotation', /^\s*@([^=]*)=(.*)$/, (match) => ({ name: match[1].trim(), value: match[2].trim() })),
      this._createEmitter('feature', /^feature\s*:\s*(.*)/i, (match) => ({ title: match[1].trim() })),
      this._createEmitter('scenario', /^scenario\s*:\s*(.*)/i, (match) => ({ title: match[1].trim() })),
      this._createEmitter('blank_line', /^\s*$/),
      this._createEmitter('multi_line_comment', /^\s*#{3,}\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createEmitter('single_line_comment', /^\s*#\s*(.*)/, (match) => ({ text: match[1].trim() })),
      this._createEmitter('text', /^(.*)$/, (match) => ({ text: match[1].trim() })),
    ].find((fn) => fn(line, number));
  }

  _createEmitter(eventName, regexp, parser) {
    return (line, number) => {
      debug(`Checking for event: ${eventName} by testing line: [${line}] with regexp: ${regexp}`);
      const match = regexp.exec(line);
      if (!match) return false;
      const data = parser ? parser(match) : {};
      this._handler.handle({ name: eventName, source: { line, number }, data });
      return true;
    };
  }
};
