const expect = require('expect');
const { Parsing } = require('../..');
const { SpecificationParser } =  Parsing;

describe('Specification Parser', () => {

  describe('Annotations', () => {

    it('should emit simple annotation events', () => {
      const { parser, invocations } = initParser();

      parser.on('annotation', (event) => {
        expect(event.source.line).toBe('@skip');
        expect(event.source.number).toBe(1);
        expect(event.name).toBe('skip');
        expect(event.value).toBe(true);
      });

      parser.parse('@skip');

      expect(invocations.count).toBe(1);
    });

    it('should trim simple annotation names', () => {
      const { parser, invocations } = initParser();

      parser.on('annotation', (event) => {
        expect(event.name).toBe('skip');
      });

      parser.parse('@skip   ');

      expect(invocations.count).toBe(1);
    });

    it('should emit name value annotation events', () => {
      const { parser, invocations } = initParser();

      parser.on('annotation', (event) => {
        expect(event.source.line).toBe('@browser=firefox');
        expect(event.source.number).toBe(1);
        expect(event.name).toBe('browser');
        expect(event.value).toBe('firefox');
      });

      parser.parse('@browser=firefox');

      expect(invocations.count).toBe(1);
    });

    it('should trim name value annotations', () => {
      const { parser, invocations } = initParser();

      parser.on('annotation', (event) => {
        expect(event.name).toBe('browser');
        expect(event.value).toBe('firefox');
      });

      parser.parse('@browser = firefox ');

      expect(invocations.count).toBe(1);
    });
  });

  describe('Features', () => {

    it('should emit feature events', () => {
      const { parser, invocations } = initParser();

      parser.on('feature', (event) => {
        expect(event.source.line).toBe('Feature: Some feature');
        expect(event.source.number).toBe(1);
        expect(event.title).toBe('Some feature');
      });

      parser.parse('Feature: Some feature');

      expect(invocations.count).toBe(1);
    });

    it('should trim feature titles', () => {
      const { parser, invocations } = initParser();

      parser.on('feature', (event) => {
        expect(event.title).toBe('Some feature');
      });

      parser.parse('Feature:   Some feature   ');

      expect(invocations.count).toBe(1);
    });
  });

  describe('Scenarios', () => {

    it('should emit scenario events', () => {
      const { parser, invocations } = initParser();

      parser.on('scenario', (event) => {
        expect(event.source.line).toBe('Scenario: Some scenario');
        expect(event.source.number).toBe(1);
        expect(event.title).toBe('Some scenario');
      });

      parser.parse('Scenario: Some scenario');

      expect(invocations.count).toBe(1);
    });

    it('should trim scenario titles', () => {
      const { parser, invocations } = initParser();

      parser.on('scenario', (event) => {
        expect(event.title).toBe('Some scenario');
      });

      parser.parse('Scenario:   Some scenario   ');

      expect(invocations.count).toBe(1);
    });
  });

  describe('Blank lines', () => {

    it('should emit blank line events (1)', () => {
      const { parser, invocations } = initParser();

      parser.on('blank_line', (event) => {
        expect(event.source.line).toBe('');
        expect(event.source.number).toBe(1);
      });

      parser.parse('');

      expect(invocations.count).toBe(1);
    });

    it('should emit blank line events (2)', () => {
      const { parser, invocations } = initParser();

      parser.on('blank_line', (event) => {
        expect(event.source.line).toBe('  ');
        expect(event.source.number).toBe(1);
      });

      parser.parse('  ');

      expect(invocations.count).toBe(1);
    });
  });

  describe('Text', () => {

    it('should emit text events', () => {
      const { parser, invocations } = initParser();

      parser.on('scenario', (event) => {
        expect(event.source.line).toBe('Some text');
        expect(event.source.number).toBe(1);
        expect(event.text).toBe('Some text');
      });

      parser.parse('Some text');

      expect(invocations.count).toBe(1);
    });

    it('should trim text', () => {
      const { parser, invocations } = initParser();

      parser.on('scenario', (event) => {
        expect(event.source.line).toBe('   Some text  ');
        expect(event.source.number).toBe(1);
        expect(event.text).toBe('Some text');
      });

      parser.parse('   Some text  ');

      expect(invocations.count).toBe(1);
    });
  });

  describe('Single line comments', () => {

    it('should emit single line comment events', () => {
      const { parser, invocations } = initParser();

      parser.on('single_line_comment', (event) => {
        expect(event.source.line).toBe('#Some comment');
        expect(event.source.number).toBe(1);
        expect(event.comment).toBe('Some comment');
      });

      parser.parse('#Some comment');

      expect(invocations.count).toBe(1);
    });

    it('should trim single line comments', () => {
      const { parser, invocations } = initParser();

      parser.on('single_line_comment', (event) => {
        expect(event.source.line).toBe('  #   Some comment   ');
        expect(event.source.number).toBe(1);
        expect(event.comment).toBe('Some comment');
      });

      parser.parse('  #   Some comment   ');

      expect(invocations.count).toBe(1);
    });
  });

  describe('Multi line comments', () => {

    it('should emit multi line comment events', () => {
      const { parser, invocations } = initParser();

      parser.on('multi_line_comment', (event) => {
        expect(event.source.line).toBe('###Some comment');
        expect(event.source.number).toBe(1);
        expect(event.comment).toBe('Some comment');
      });

      parser.parse('###Some comment');

      expect(invocations.count).toBe(1);
    });

    it('should trim multi line comments', () => {
      const { parser, invocations } = initParser();

      parser.on('multi_line_comment', (event) => {
        expect(event.source.line).toBe('  ####   Some comment   ');
        expect(event.source.number).toBe(1);
        expect(event.comment).toBe('Some comment');
      });

      parser.parse('  ####   Some comment   ');

      expect(invocations.count).toBe(1);
    });
  });

  function initParser() {
    const invocations = new Invocations();
    const parser = new SpecificationParser()
      .on('annotation', () => invocations.register())
      .on('feature', () => invocations.register())
      .on('scenario', () => invocations.register())
      .on('blank_line', () => invocations.register())
      .on('multi_line_comment', () => invocations.register())
      .on('single_line_comment', () => invocations.register())
      .on('text', () => invocations.register());
    return { invocations, parser };
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
