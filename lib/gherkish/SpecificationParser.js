const debug = require('debug')('yadda:gherkish:SpecificationParser');
const Languages = require('./languages');
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
      const indentation =  Math.max(line.search(/[^\s/]/), 0);
      SpecificationParser._parseLine(session, { line, number, indentation });
    });
  }

  static _parseLine(session, source) {
    debug(`Parsing line ${source.number}: "${source.line}" in state: ${session.machine.state}`);
    const event = SpecificationParser._getEvents(session).find((event) => event.test(source.line));
    session.machine.handle({
      name: event.name,
      handler: event.handler,
      source,
      data: event.parse(source.line),
    }, session);
  }

  static _getEvents(session) {
    return [{
      name: 'end',
      handler: 'onEnd',
      regexp: /^\u0000$/,
      extract: () => ({}),
    },
    {
      name: 'language',
      handler: 'onLanguage',
      regexp: /^\s*#\s*language\s*:(.*)$/i,
      extract: (match) => ({ name: match[1].trim() }),
    },
    {
      name: 'annotation',
      handler: 'onAnnotation',
      regexp: /^\s*@([^=]*)$/,
      extract: (match) => ({ name: match[1].trim(), value: true }),
    },
    {
      name: 'annotation',
      handler: 'onAnnotation',
      regexp: /^\s*@([^=]*)=(.*)$/,
      extract: (match) => ({ name: match[1].trim(), value: match[2].trim() }),
    },
    {
      name: 'feature',
      handler: 'onFeature',
      regexp: session.language.regexp('feature'),
      extract: (match) => ({ title: match[1].trim() }),
    },
    {
      name: 'background',
      handler: 'onBackground',
      regexp: session.language.regexp('background'),
      extract: (match) => ({ title: match[1].trim() }),
    },
    {
      name: 'scenario',
      handler: 'onScenario',
      regexp: session.language.regexp('scenario'),
      extract: (match) => ({ title: match[1].trim() }),
    },
    {
      name: 'blank_line',
      handler: 'onBlankLine',
      regexp: /^\s*$/,
      extract: () => ({}),
    },
    {
      name: 'multi_line_comment',
      handler: 'onMultiLineComment',
      regexp: /^\s*#{3,}\s*(.*)/,
      extract: (match) => ({ text: match[1].trim() }),
    },
    {
      name: 'single_line_comment',
      handler: 'onSingleLineComment',
      regexp: /^\s*#\s*(.*)/,
      extract: (match) => ({ text: match[1].trim() }),
    },
    {
      name: 'step',
      handler: 'onStep',
      regexp: session.language.regexp('step'),
      extract: (match) => ({ text: match[0].trim(), generalised: match[1].trim() }),
    },
    {
      name: 'text',
      handler: 'onText',
      regexp: /^(.*)$/,
      extract: (match) => ({ text: match[1].trim() }),
    }].map((props) => SpecificationParser._decorate(props));
  }

  static _decorate(props) {
    return {
      ...props,
      test: (text) => props.regexp.test(text),
      parse: (text) => {
        const match = props.regexp.exec(text);
        return props.extract(match);
      }
    };
  }
};
