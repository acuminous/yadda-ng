const debug = require('debug')('yadda:converters:GeographicCoordinatesConverter');
const BaseConverter = require('./BaseConverter');

module.exports = class GeographicCoordinatesConverter extends BaseConverter {
  async convert(state, latitude, longitude) {
    debug(`Converting [${latitude}, ${longitude}]`);
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }
};
