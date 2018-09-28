const { Library } = require('../../..');
const { commonDictionary } = require('../dictionaries');

module.exports = new Library({ name: 'AdvancedLibrary', dictionaries: [ commonDictionary ] })
  .define('the following graffiti is sprayed on the wall', (state, graffiti) => {
    state.wall.spray(graffiti);
  });
