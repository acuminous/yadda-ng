const assert = require('assert');
const { Library } = require('../../..');

module.exports = new Library({ name: 'Duplicate Library 2' })
  .define('a step that is repeated in multiple libraries', (state) => {})
  .define('the step is invoked', (state) => {})
  .define('it should be selected from $libraryName', (state, libraryName) => {
    assert.equal(state.get('currentLibrary'), libraryName);
  });
