const Debug = require('debug');
const os = require('os');
const BaseConverter = require('./BaseConverter');
const PassThroughConverter = require('./PassThroughConverter');

module.exports = class ListConverter extends BaseConverter {

  constructor(props = {}) {
    const {
      regexp = new RegExp(os.EOL),
      converter = new PassThroughConverter(),
      debug = Debug('yadda:converters:ListConverter'),
    } = props;

    super({ debug });
    this._regex = regexp;
    this._converter = converter;
  }

  async convert(state, value) {
    this._debug(`Converting [${value}]`);
    return Array.from(value.split(this._regex)).reduce((p, item) => {
      return p.then(async (results) => {
        return results.concat(await this._converter.convert(state, item));
      });
    }, Promise.resolve([]));
  }
};
