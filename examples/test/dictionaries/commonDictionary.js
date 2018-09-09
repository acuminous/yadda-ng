const { Dictionary, Converters } = require('../../..');
const { BooleanConverter, DateConverter, NumberConverter } = Converters;

module.exports = new Dictionary()
  .define('boolean', /(true|false)/i, [ new BooleanConverter() ])
  .define('date', /(\d{4}\/\d{2}\/\d{2})/, [ new DateConverter() ])
  .define('number', /([+-]?\d+(?:\.\d+)?)/, [ new NumberConverter() ])
  .define('data', /([^\u0000]*)/);
