const { Script } = require('../..');

module.exports = new Script({ source: [
  {
    title: 'Some feature',
    scenarios: [
      {
        annotations: {
          timeout: 1000,
        },
        title: 'Scenario 1',
        steps: [
          { statement: 'Step 1' },
          { statement: 'Step 2' },
        ]
      },
      {
        title: 'Scenario 2',
        steps: [
          { statement: 'Step 1' },
          { statement: 'Step 2' },
        ]
      }
    ]
  }
] });
