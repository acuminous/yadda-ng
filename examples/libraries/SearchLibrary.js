const { Library } = require('../..');

module.exports = new Library({ name: 'search' })
  .define('Step 2', () => {
    console.log('Step 2');
  });
