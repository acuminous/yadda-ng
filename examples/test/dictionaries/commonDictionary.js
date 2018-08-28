const { Dictionary, Converters } = require('../../..');
const { NumberConverter } = Converters;

module.exports = new Dictionary()
  .define('number', /(\d+)/, [ new NumberConverter() ])
  .define('data', /([^\u0000]*)/);
