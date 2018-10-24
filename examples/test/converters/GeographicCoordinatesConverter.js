const debug = require('debug')('yadda:examples:FeetConverter');
const { Converters } = require('../../..');

module.exports = class GeographicCoordinatesConverter extends Converters.BaseConverter {
  async convert(state, latitude, longitude) {
    debug(`Converting [${latitude}, ${longitude}]`);
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }
};
