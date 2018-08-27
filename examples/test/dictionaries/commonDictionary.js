const { Dictionary, Converters } = require('../../..');

module.exports = new Dictionary()
  .define('number', /(\d+)/, [ new Converters.NumberConverter() ]);
