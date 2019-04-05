const Debug = require('debug');
const { Converters } = require('../../..');
const { BaseConverter } = Converters;

module.exports = class GeographicCoordinatesConverter extends BaseConverter {

  constructor() {
    super({ debug: Debug('yadda:examples:GeographicCoordinatesConverter') });
  }

  async convert(state, latitude, longitude) {
    this._debug(`Converting [${latitude}, ${longitude}]`);
    return { latitude: Number(latitude), longitude: Number(longitude) };
  }
};
