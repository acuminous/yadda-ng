const debug = require('debug')('yadda-ng:macros:Macro');
const { PendingStep, AsyncStep } = require('./Steps');

module.exports = class Macro {
  constructor({ type, template, pattern, converter, fn }) {
    this._type = type;
    this._template = template;
    this._pattern = pattern;
    this._converter = converter;
    this._fn = fn;
  }

  answersTo(template) {
    return this._template === template;
  }

  supports(text) {
    return !!this._match(text);
  }

  toStep(annotations, text) {
    return this._getFactory()(annotations, text, this._type, this);
  }

  async run(state, text) {
    const args = await this._parseArguments(state, text);
    debug(`Calling [${this._template}] with state: [${Object.keys(state)}], args: [${args}]`);
    await this._fn.call(null, state, args);
  }

  _match(text) {
    this._pattern.lastIndex = 0;
    return this._pattern.exec(text);
  }

  _getFactory() {
    if (!this._fn) return (annotations, text, type) => new PendingStep({ annotations, text, type });
    return (annotations, text, type, macro) => new AsyncStep({ annotations, text, type, macro });
  }

  async _parseArguments(state, text) {
    const match = this._match(text);
    return await this._converter.convert(state, match);
  }
};
