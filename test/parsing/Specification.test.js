const expect = require('expect');
const { Languages } = require('../..');
const { Parsing } = require('../..');
const { Specification } =  Parsing;

describe('Specification', () => {

  describe('Parsing', () => {
    it('Parses specifications', () => {
      const parser = new Specification();
      const specification = parser.parse([
        '@Skip',
        'Feature: Some feature',
        '',
        '   Background:',
        '   First background step',
        '',
        '   @Browser = Firefox',
        '   Scenario: First scenario',
        '      First step',
        '      Second step',
        '',
        '   Scenario: Second scenario',
        '      Third step',
        '      Fourth step',

      ].join('\n')).export();

      expect(specification.annotations[0].name).toBe('Skip');
      expect(specification.annotations[0].value).toBe(true);
      expect(specification.title).toBe('Some feature');
      expect(specification.scenarios[0].annotations[0].name).toBe('Browser');
      expect(specification.scenarios[0].annotations[0].value).toBe('Firefox');
      expect(specification.scenarios[0].title).toBe('First scenario');
      expect(specification.scenarios[0].steps[0].text).toBe('First background step');
      expect(specification.scenarios[0].steps[1].text).toBe('First step');
      expect(specification.scenarios[0].steps[2].text).toBe('Second step');
      expect(specification.scenarios[1].title).toBe('Second scenario');
      expect(specification.scenarios[1].steps[0].text).toBe('First background step');
      expect(specification.scenarios[1].steps[1].text).toBe('Third step');
      expect(specification.scenarios[1].steps[2].text).toBe('Fourth step');
    });

    it('Parses specifications in the specified languages', () => {
      const parser = new Specification({ language: new Languages.Pirate() });
      const specification = parser.parse([
        '@Skip',
        'Tale: Some feature',
        '',
        '   Aftground:',
        '   Giveth first background step',
        '',
        '   @Browser = Firefox',
        '   Adventure: First scenario',
        '      Giveth first step',
        '      Whence second step',
        '',
        '   Sortie: Second scenario',
        '      Thence third step',
        '      And fourth step',
      ].join('\n')).export();

      expect(specification.annotations[0].name).toBe('Skip');
      expect(specification.annotations[0].value).toBe(true);
      expect(specification.title).toBe('Some feature');
      expect(specification.scenarios[0].annotations[0].name).toBe('Browser');
      expect(specification.scenarios[0].annotations[0].value).toBe('Firefox');
      expect(specification.scenarios[0].title).toBe('First scenario');
      expect(specification.scenarios[0].steps[0].text).toBe('Giveth first background step');
      expect(specification.scenarios[0].steps[1].text).toBe('Giveth first step');
      expect(specification.scenarios[0].steps[2].text).toBe('Whence second step');
      expect(specification.scenarios[1].title).toBe('Second scenario');
      expect(specification.scenarios[1].steps[0].text).toBe('Giveth first background step');
      expect(specification.scenarios[1].steps[1].text).toBe('Thence third step');
      expect(specification.scenarios[1].steps[2].text).toBe('And fourth step');
    });
  });

  describe('Annotations', () => {

    it('should emit simple annotation events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('annotation');
        expect(event.source.line).toBe('@skip');
        expect(event.source.number).toBe(1);
        expect(event.data.name).toBe('skip');
        expect(event.data.value).toBe(true);
      });

      new Specification({ state: handler }).parse('@skip');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim simple annotation names', () => {
      const handler = initHandler((event) => {
        expect(event.source.line).toBe('@skip   ');
        expect(event.data.name).toBe('skip');
      });

      new Specification({ state: handler }).parse('@skip   ');

      expect(handler.invocations.count).toBe(1);
    });

    it('should emit name value annotation events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('annotation');
        expect(event.source.line).toBe('@browser=firefox');
        expect(event.source.number).toBe(1);
        expect(event.data.name).toBe('browser');
        expect(event.data.value).toBe('firefox');
      });

      new Specification({ state: handler }).parse('@browser=firefox');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim name value annotations', () => {
      const handler = initHandler((event) => {
        expect(event.source.line).toBe(' @browser = firefox ');
        expect(event.data.name).toBe('browser');
        expect(event.data.value).toBe('firefox');
      });

      new Specification({ state: handler }).parse(' @browser = firefox ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Features', () => {

    it('should emit feature events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('feature');
        expect(event.source.line).toBe('Feature: Some feature');
        expect(event.source.number).toBe(1);
        expect(event.data.title).toBe('Some feature');
      });

      new Specification({ state: handler }).parse('Feature: Some feature');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim feature titles', () => {
      const handler = initHandler((event) => {
        expect(event.source.line).toBe('Feature:   Some feature   ');
        expect(event.data.title).toBe('Some feature');
      });

      new Specification({ state: handler }).parse('Feature:   Some feature   ');

      expect(handler.invocations.count).toBe(1);
    });

    it('should localise feature keyword', () => {

      const handler = initHandler((event) => {
        expect(event.source.line).toBe('Feature:   Some feature   ');
        expect(event.data.title).toBe('Some feature');
      });

      new Specification({ state: handler }).parse('Feature:   Some feature   ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Scenarios', () => {

    it('should emit scenario events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('scenario');
        expect(event.source.line).toBe('Scenario: Some scenario');
        expect(event.source.number).toBe(1);
        expect(event.data.title).toBe('Some scenario');
      });

      new Specification({ state: handler }).parse('Scenario: Some scenario');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim scenario titles', () => {
      const handler = initHandler((event) => {
        expect(event.source.line).toBe('Scenario:   Some scenario   ');
        expect(event.data.title).toBe('Some scenario');
      });

      new Specification({ state: handler }).parse('Scenario:   Some scenario   ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Backgrounds', () => {

    it('should emit background events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('background');
        expect(event.source.line).toBe('Background: Some background');
        expect(event.source.number).toBe(1);
        expect(event.data.title).toBe('Some background');
      });

      new Specification({ state: handler }).parse('Background: Some background');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim background titles', () => {
      const handler = initHandler((event) => {
        expect(event.source.line).toBe('Background:   Some background   ');
        expect(event.data.title).toBe('Some background');
      });

      new Specification({ state: handler }).parse('Background:   Some background   ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Blank lines', () => {

    it('should emit blank line events (1)', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('blank_line');
        expect(event.source.line).toBe('');
        expect(event.source.number).toBe(1);
      });

      new Specification({ state: handler }).parse('');

      expect(handler.invocations.count).toBe(1);
    });

    it('should emit blank line events (2)', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('blank_line');
        expect(event.source.line).toBe('  ');
        expect(event.source.number).toBe(1);
      });

      new Specification({ state: handler }).parse('  ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Text', () => {

    it('should emit text events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('text');
        expect(event.source.line).toBe('Some text');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Some text');
      });

      new Specification({ state: handler }).parse('Some text');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim text', () => {
      const handler = initHandler((event) => {
        expect(event.data.text).toBe('Some text');
      });

      new Specification({ state: handler }).parse('   Some text  ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Single line comments', () => {

    it('should emit single line comment events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('single_line_comment');
        expect(event.source.line).toBe('#Some comment');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Some comment');
      });

      new Specification({ state: handler }).parse('#Some comment');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim single line comments', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('single_line_comment');
        expect(event.source.line).toBe('  #   Some comment   ');
        expect(event.data.text).toBe('Some comment');
      });

      new Specification({ state: handler }).parse('  #   Some comment   ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  describe('Multi line comments', () => {

    it('should emit multi line comment events', () => {
      const handler = initHandler((event) => {
        expect(event.name).toBe('multi_line_comment');
        expect(event.source.line).toBe('###Some comment');
        expect(event.data.text).toBe('Some comment');
      });

      new Specification({ state: handler }).parse('###Some comment');

      expect(handler.invocations.count).toBe(1);
    });

    it('should trim multi line comments', () => {
      const handler = initHandler((event) => {
        expect(event.source.line).toBe('  ####   Some comment   ');
        expect(event.data.text).toBe('Some comment');
      });

      new Specification({ state: handler }).parse('  ####   Some comment   ');

      expect(handler.invocations.count).toBe(1);
    });
  });

  function initHandler(assertions) {
    const invocations = new Invocations();
    return {
      handle: function handle(event) {
        if (event.name === 'end') return;
        invocations.register();
        assertions(event);
        return { handle: handle };
      },
      invocations,
      export: () => null,
    };
  }

  class Invocations {
    constructor() {
      this.count = 0;
    }
    register() {
      this.count++;
    }
  }

});
