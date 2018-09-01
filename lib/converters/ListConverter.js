const debug = require('debug')('yadda:converters:ListConverter');
const BaseConverter = require('./BaseConverter');
const PassthroughConverter = require('./PassthroughConverter');

module.exports = class ListConverter extends BaseConverter {
  constructor(props = {}) {
    super(props);
    this._regex = props.regexp || /\n/;
    this._converter = props.converter || new PassthroughConverter();
  }

  async convert(state, value) {
    debug(`Converting [${value}]`);
    return Array.from(value.split(this._regex)).reduce((p, item) => {
      return p.then(async (results) => {
        return results.concat(await this._converter.convert(state, item));
      });
    }, Promise.resolve([]));
  }
};
