const { Library } = require('../../..');
const { commonDictionary } = require('../dictionaries');
const assert = require('assert');

module.exports = new Library({ name: 'ConvertersLibrary', dictionaries: [ commonDictionary ] })
  .define('something is $boolean', (state, argument) => {
    state.argument = argument;
  })
  .define('the date is $date', (state, argument) => {
    state.argument = argument;
  })
  .define('a value of $number', (state, argument) => {
    state.argument = argument;
  })
  .define('the argument should be a $type', (state, type) => {
    switch (type) {
      case 'date': {
        assert.ok(state.argument instanceof Date);
        break;
      }
      default: {
        assert.equal(typeof state.argument, type);
        break;
      }
    }
  });
