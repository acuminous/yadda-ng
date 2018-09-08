const { Library } = require('../../..');
const { commonDictionary } = require('../dictionaries');
const assert = require('assert');

module.exports = new Library({ name: 'ConvertersLibrary', dictionaries: [ commonDictionary ] })
  .define('a $boolean value', (state, argument) => {
    state.argument = argument;
  })
  .define('a $date value', (state, argument) => {
    state.argument = argument;
  })
  .define('a $numeric value', (state, argument) => {
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
