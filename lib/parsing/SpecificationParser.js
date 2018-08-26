const debug = require('debug')('yadda-ng:parsing:SpecificationParser');
const EventEmitter = require('events');

module.exports = class SpecificationParser extends EventEmitter {

  parse(text) {
    text.split(/\n|\r\n/).forEach((line, index) => this._parseLine(line, index + 1));
  }

  _parseLine(line, number) {
    [
      this._createEmitter('annotation', /^\s*@([^=]*)$/, (match) => ({ name: match[1].trim(), value: true })),
      this._createEmitter('annotation', /^\s*@([^=]*)=(.*)$/, (match) => ({ name: match[1].trim(), value: match[2].trim() })),
      this._createEmitter('feature', /^feature\s*:\s*(.*)/i, (match) => ({ title: match[1].trim() })),
      this._createEmitter('scenario', /^scenario\s*:\s*(.*)/i, (match) => ({ title: match[1].trim() })),
      this._createEmitter('blank_line', /^\s*$/),
      this._createEmitter('multi_line_comment', /^\s*#{3,}\s*(.*)/, (match) => ({ comment: match[1].trim() })),
      this._createEmitter('single_line_comment', /^\s*#\s*(.*)/, (match) => ({ comment: match[1].trim() })),
      this._createEmitter('text', /^(.*)$/, (match) => ({ text: match[1].trim() })),
    ].find((fn) => fn(line, number));
  }

  _createEmitter(event, regexp, parser) {
    return (line, number) => {
      const match = regexp.exec(line);
      if (!match) return false;
      const extra = parser ? parser(match) : {};
      this.emit(event, { source: { line, number }, ...extra });
      return true;
    };
  }
};
