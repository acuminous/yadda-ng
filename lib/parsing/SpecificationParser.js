const debug = require('debug')('yadda-ng:parsing:SpecificationParser');
const Languages = require('../languages');

module.exports = class SpecificationParser {

  constructor({ handler, language = Languages.default }) {
    this._handler = handler;
    this._language = language;
  }

  parse(text) {
    text.split(/\n|\r\n/).forEach((line, index) => this._parseLine(line, index + 1));
    this._handler.handle({ name: 'end' });
  }

  _parseLine(line, number) {
    [
      this._createEmitter('annotation', /^\s*@([^=]*)$/, (match) => ({ name: match[1].trim(), value: true })),
      this._createEmitter('annotation', /^\s*@([^=]*)=(.*)$/, (match) => ({ name: match[1].trim(), value: match[2].trim() })),
      this._createEmitter('feature', this._language.regexp('feature'), (match) => ({ title: match[1].trim() })),
      this._createEmitter('background', this._language.regexp('background'), (match) => ({ title: match[1].trim() })),
      this._createEmitter('scenario', this._language.regexp('scenario'), (match) => ({ title: match[1].trim() })),
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
