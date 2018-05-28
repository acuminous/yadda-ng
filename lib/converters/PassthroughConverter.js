const debug = require('debug')('yadda-ng:converters:PassthroughConverter');

module.exports = class PassthroughConverter {
  async convert(state, match) {
    debug(`Converting match: [${match}]`);
    return match.splice(1);
  }
};
