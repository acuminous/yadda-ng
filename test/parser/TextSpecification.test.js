const expect = require('expect');
const { Parser } = require('../..');
const { TextSpecification, Languages, States } = Parser;
const { BaseState } = States;

describe('Text Specification', () => {

  describe('Parsing', () => {
    it('Parses specifications using the default language (none)', () => {
      const text = [
        '@skip',
        'Feature: Some feature',
        '',
        'Some free form text',
        '',
        '   @timeout=1000',
        '   Background: The background',
        '   First background step',
        '',
        '   @browser = Firefox',
        '   Scenario: First scenario',
        '      First step',
        '      Second step',
        '',
        '   Scenario: Second scenario',
        '      Third step',
        '      Fourth step',

      ].join('\n');

      const specification = new TextSpecification();
      const document = specification.parse(text).export();

      expect(document.description).toBe('Some free form text');
      expect(document.annotations[0].name).toBe('skip');
      expect(document.annotations[0].value).toBe(true);
      expect(document.title).toBe('Some feature');
      expect(document.background.annotations[0].name).toBe('timeout');
      expect(document.background.annotations[0].value).toBe('1000');
      expect(document.background.title).toBe('The background');
      expect(document.background.steps[0].statement).toBe('First background step');
      expect(document.scenarios[0].annotations[0].name).toBe('browser');
      expect(document.scenarios[0].annotations[0].value).toBe('Firefox');
      expect(document.scenarios[0].title).toBe('First scenario');
      expect(document.scenarios[0].steps[0].statement).toBe('First step');
      expect(document.scenarios[0].steps[1].statement).toBe('Second step');
      expect(document.scenarios[1].title).toBe('Second scenario');
      expect(document.scenarios[1].steps[0].statement).toBe('Third step');
      expect(document.scenarios[1].steps[1].statement).toBe('Fourth step');
    });

    it('Parses specifications in the language defined in the specficiation', () => {
      const text = [
        '#language: Pirate',
        '',
        '@skip',
        'Tale: Some feature',
        '',
        'Pieces of eight',
        '',
        '   @timeout=1000',
        '   Aftground: A long time ago',
        '   Here be a tale of much woe',
        '',
        '   Giveth first background step',
        '',
        '   @browser = Firefox',
        '   Adventure: First scenario',
        '      Giveth first step',
        '      Whence second step',
        '',
        '   Sortie: Second scenario',
        '      Thence third step',
        '      And fourth step',
      ].join('\n');

      const specification = new TextSpecification();
      const document = specification.parse(text).export();

      expect(document.description).toBe('Pieces of eight');
      expect(document.annotations[0].name).toBe('skip');
      expect(document.annotations[0].value).toBe(true);
      expect(document.title).toBe('Some feature');
      expect(document.background.annotations[0].name).toBe('timeout');
      expect(document.background.annotations[0].value).toBe('1000');
      expect(document.background.title).toBe('A long time ago');
      expect(document.background.description).toBe('Here be a tale of much woe');
      expect(document.background.steps[0].statement).toBe('Giveth first background step');
      expect(document.background.steps[0].generalised).toBe('first background step');
      expect(document.scenarios[0].annotations[0].name).toBe('browser');
      expect(document.scenarios[0].annotations[0].value).toBe('Firefox');
      expect(document.scenarios[0].title).toBe('First scenario');
      expect(document.scenarios[0].steps[0].statement).toBe('Giveth first step');
      expect(document.scenarios[0].steps[1].statement).toBe('Whence second step');
      expect(document.scenarios[1].title).toBe('Second scenario');
      expect(document.scenarios[1].steps[0].statement).toBe('Thence third step');
      expect(document.scenarios[1].steps[1].statement).toBe('And fourth step');
    });

    it('should report missing languages', () => {
      const text = [
        '#language: Missing',
        'Feature: Some feature',
      ].join('\n');

      const specification = new TextSpecification();

      expect(() => specification.parse(text)).toThrow('Language: Missing was not found');
    });

    it('Parses specifications in the language given in the constructor', () => {
      const text = [
        '@skip',
        'Tale: Some feature',
        '',
        'Pieces of eight',
        '',
        '   @timeout=1000',
        '   Aftground: A long time ago',
        '   Here be a tale of much woe',
        '',
        '   Giveth first background step',
        '',
        '   @browser = Firefox',
        '   Adventure: First scenario',
        '      Giveth first step',
        '      Whence second step',
        '',
        '   Sortie: Second scenario',
        '      Thence third step',
        '      And fourth step',
      ].join('\n');

      const specification = new TextSpecification({ language: new Languages.Pirate() });
      const document = specification.parse(text).export();

      expect(document.description).toBe('Pieces of eight');
      expect(document.annotations[0].name).toBe('skip');
      expect(document.annotations[0].value).toBe(true);
      expect(document.title).toBe('Some feature');
      expect(document.background.annotations[0].name).toBe('timeout');
      expect(document.background.annotations[0].value).toBe('1000');
      expect(document.background.title).toBe('A long time ago');
      expect(document.background.description).toBe('Here be a tale of much woe');
      expect(document.background.steps[0].statement).toBe('Giveth first background step');
      expect(document.background.steps[0].generalised).toBe('first background step');
      expect(document.scenarios[0].annotations[0].name).toBe('browser');
      expect(document.scenarios[0].annotations[0].value).toBe('Firefox');
      expect(document.scenarios[0].title).toBe('First scenario');
      expect(document.scenarios[0].steps[0].statement).toBe('Giveth first step');
      expect(document.scenarios[0].steps[1].statement).toBe('Whence second step');
      expect(document.scenarios[1].title).toBe('Second scenario');
      expect(document.scenarios[1].steps[0].statement).toBe('Thence third step');
      expect(document.scenarios[1].steps[1].statement).toBe('And fourth step');
    });
  });

  it('should be multi use', () => {
    const text1 = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '   First background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      First step',
      '      Second step',
      '',
      '   Scenario: Second scenario',
      '      Third step',
      '      Fourth step',
    ].join('\n');
    const text2 = text1.replace('Some feature', 'Another feature');

    const specification = new TextSpecification();
    const result1 = specification.parse(text1);
    const result2 = specification.parse(text2);

    expect(result1.export().title).toBe('Some feature');
    expect(result2.export().title).toBe('Another feature');
  });

  describe('Annotations', () => {

    it('should emit simple annotation events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('annotation');
        expect(event.source.line).toBe('@skip');
        expect(event.source.number).toBe(1);
        expect(event.data.name).toBe('skip');
        expect(event.data.value).toBe(true);
      });

      new TextSpecification({ initialState: state }).parse('@skip');

      expect(state.count).toBe(1);
    });

    it('should trim simple annotation names', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('@skip   ');
        expect(event.data.name).toBe('skip');
      });

      new TextSpecification({ initialState: state }).parse('@skip   ');

      expect(state.count).toBe(1);
    });

    it('should emit name value annotation events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('annotation');
        expect(event.source.line).toBe('@browser=firefox');
        expect(event.source.number).toBe(1);
        expect(event.data.name).toBe('browser');
        expect(event.data.value).toBe('firefox');
      });

      new TextSpecification({ initialState: state }).parse('@browser=firefox');

      expect(state.count).toBe(1);
    });

    it('should trim name value annotations', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe(' @browser = firefox ');
        expect(event.data.name).toBe('browser');
        expect(event.data.value).toBe('firefox');
      });

      new TextSpecification({ initialState: state }).parse(' @browser = firefox ');

      expect(state.count).toBe(1);
    });
  });

  describe('Features', () => {

    it('should emit feature events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('feature');
        expect(event.source.line).toBe('Feature: Some feature');
        expect(event.source.number).toBe(1);
        expect(event.data.title).toBe('Some feature');
      });

      new TextSpecification({ initialState: state }).parse('Feature: Some feature');

      expect(state.count).toBe(1);
    });

    it('should trim feature titles', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('Feature:   Some feature   ');
        expect(event.data.title).toBe('Some feature');
      });

      new TextSpecification({ initialState: state }).parse('Feature:   Some feature   ');

      expect(state.count).toBe(1);
    });

    it('should localise feature keyword', () => {

      const state = new StubState((event) => {
        expect(event.source.line).toBe('Feature:   Some feature   ');
        expect(event.data.title).toBe('Some feature');
      });

      new TextSpecification({ initialState: state }).parse('Feature:   Some feature   ');

      expect(state.count).toBe(1);
    });
  });

  describe('Scenarios', () => {

    it('should emit scenario events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('scenario');
        expect(event.source.line).toBe('Scenario: Some scenario');
        expect(event.source.number).toBe(1);
        expect(event.data.title).toBe('Some scenario');
      });

      new TextSpecification({ initialState: state }).parse('Scenario: Some scenario');

      expect(state.count).toBe(1);
    });

    it('should trim scenario titles', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('Scenario:   Some scenario   ');
        expect(event.data.title).toBe('Some scenario');
      });

      new TextSpecification({ initialState: state }).parse('Scenario:   Some scenario   ');

      expect(state.count).toBe(1);
    });
  });

  describe('Backgrounds', () => {

    it('should emit background events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('background');
        expect(event.source.line).toBe('Background: Some background');
        expect(event.source.number).toBe(1);
        expect(event.data.title).toBe('Some background');
      });

      new TextSpecification({ initialState: state }).parse('Background: Some background');

      expect(state.count).toBe(1);
    });

    it('should trim background titles', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('Background:   Some background   ');
        expect(event.data.title).toBe('Some background');
      });

      new TextSpecification({ initialState: state }).parse('Background:   Some background   ');

      expect(state.count).toBe(1);
    });
  });

  describe('Blank lines', () => {

    it('should emit blank line events (1)', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('blank_line');
        expect(event.source.line).toBe('');
        expect(event.source.number).toBe(1);
      });

      new TextSpecification({ initialState: state }).parse('');

      expect(state.count).toBe(1);
    });

    it('should emit blank line events (2)', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('blank_line');
        expect(event.source.line).toBe('  ');
        expect(event.source.number).toBe(1);
      });

      new TextSpecification({ initialState: state }).parse('  ');

      expect(state.count).toBe(1);
    });
  });

  describe('Step', () => {

    it('should emit step events when matching localised steps', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('step');
        expect(event.source.line).toBe('Given some step');
        expect(event.source.number).toBe(1);
        expect(event.data.statement).toBe('Given some step');
        expect(event.data.generalised).toBe('some step');
      });

      new TextSpecification({ language: new Languages.English(), initialState: state }).parse('Given some step');

      expect(state.count).toBe(1);
    });

    it('should trim localised steps', () => {
      const state = new StubState((event) => {
        expect(event.data.statement).toBe('Given some step');
        expect(event.data.generalised).toBe('some step');
      });

      new TextSpecification({ language: new Languages.English(), initialState: state }).parse('   Given some step  ');

      expect(state.count).toBe(1);
    });

    it('should emit step events when matching unlocalised text', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('step');
        expect(event.source.line).toBe('Some step');
        expect(event.source.number).toBe(1);
        expect(event.data.statement).toBe('Some step');
        expect(event.data.generalised).toBe('Some step');
      });

      new TextSpecification({ initialState: state }).parse('Some step');

      expect(state.count).toBe(1);
    });

    it('should trim localised steps', () => {
      const state = new StubState((event) => {
        expect(event.data.statement).toBe('Some step');
        expect(event.data.generalised).toBe('Some step');
      });

      new TextSpecification({ initialState: state }).parse('   Some step  ');

      expect(state.count).toBe(1);
    });
  });

  describe('Text', () => {

    it('should emit text events when not matching steps', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('text');
        expect(event.source.line).toBe('Some text');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Some text');
      });

      new TextSpecification({ language: new Languages.English(), initialState: state }).parse('Some text');

      expect(state.count).toBe(1);
    });

    it('should trim text', () => {
      const state = new StubState((event) => {
        expect(event.data.text).toBe('Some text');
      });

      new TextSpecification({ language: new Languages.English(), initialState: state }).parse('   Some text  ');

      expect(state.count).toBe(1);
    });
  });

  describe('Single line comments', () => {

    it('should emit single line comment events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('single_line_comment');
        expect(event.source.line).toBe('#Some comment');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Some comment');
      });

      new TextSpecification({ initialState: state }).parse('#Some comment');

      expect(state.count).toBe(1);
    });

    it('should trim single line comments', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('single_line_comment');
        expect(event.source.line).toBe('  #   Some comment   ');
        expect(event.data.text).toBe('Some comment');
      });

      new TextSpecification({ initialState: state }).parse('  #   Some comment   ');

      expect(state.count).toBe(1);
    });
  });

  describe('Multi line comments', () => {

    it('should emit multi line comment events', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('multi_line_comment');
        expect(event.source.line).toBe('###Some comment');
        expect(event.data.text).toBe('Some comment');
      });

      new TextSpecification({ initialState: state }).parse('###Some comment');

      expect(state.count).toBe(1);
    });

    it('should trim multi line comments', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('  ####   Some comment   ');
        expect(event.data.text).toBe('Some comment');
      });

      new TextSpecification({ initialState: state }).parse('  ####   Some comment   ');

      expect(state.count).toBe(1);
    });
  });

  class StubState extends BaseState {
    constructor(assertions) {
      super({ subject: 'specification' });
      this.count = 0;
      this.assertions = assertions;
    }
    onAnnotation(event) {
      return this.handleEvent(event);
    }
    onBackground(event) {
      return this.handleEvent(event);
    }
    onBlankLine(event) {
      return this.handleEvent(event);
    }
    onEnd(event) {
      return this;
    }
    onFeature(event) {
      return this.handleEvent(event);
    }
    onLanguage(event) {
      return this.handleEvent(event);
    }
    onMultiLineComment(event) {
      return this.handleEvent(event);
    }
    onScenario(event) {
      return this.handleEvent(event);
    }
    onSingleLineComment(event) {
      return this.handleEvent(event);
    }
    onStep(event) {
      return this.handleEvent(event);
    }
    onText(event) {
      return this.handleEvent(event);
    }
    handleEvent(event) {
      this.count++;
      this.assertions(event);
      return this;
    }
  }

});
