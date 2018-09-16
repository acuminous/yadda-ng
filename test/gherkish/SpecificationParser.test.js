const expect = require('expect');
const { Gherkish } = require('../..');
const { SpecificationParser, Languages, StateMachine, States } = Gherkish;
const { BaseState } = States;

describe('Specification Parser', () => {

  it('should parse specifications using the default language (none)', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '      First background step',
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

    const document = SpecificationParser.parse(text);

    expect(document.description).toBe('Some free form text');
    expect(document.annotations[0].name).toBe('skip');
    expect(document.annotations[0].value).toBe(true);
    expect(document.title).toBe('Some feature');
    expect(document.background.annotations[0].name).toBe('timeout');
    expect(document.background.annotations[0].value).toBe('1000');
    expect(document.background.title).toBe('The background');
    expect(document.background.steps[0].text).toBe('First background step');
    expect(document.scenarios[0].annotations[0].name).toBe('browser');
    expect(document.scenarios[0].annotations[0].value).toBe('Firefox');
    expect(document.scenarios[0].title).toBe('First scenario');
    expect(document.scenarios[0].steps[0].text).toBe('First step');
    expect(document.scenarios[0].steps[1].text).toBe('Second step');
    expect(document.scenarios[1].title).toBe('Second scenario');
    expect(document.scenarios[1].steps[0].text).toBe('Third step');
    expect(document.scenarios[1].steps[1].text).toBe('Fourth step');
  });

  it('should parse specifications in the language defined in the specficiation', () => {
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
      '      Giveth first background step',
      '      Background steps can still be free form',
      '',
      '   @browser = Firefox',
      '   Adventure: First scenario',
      '      Giveth first step',
      '      Whence second step',
      '',
      '   Sortie: Second scenario',
      '      Thence third step',
      '      And fourth step',
      '',
      '   Sortie: Third scenario',
      '      Steps can still be free form',
    ].join('\n');

    const document = SpecificationParser.parse(text);

    expect(document.description).toBe('Pieces of eight');
    expect(document.annotations[0].name).toBe('skip');
    expect(document.annotations[0].value).toBe(true);
    expect(document.title).toBe('Some feature');
    expect(document.background.annotations[0].name).toBe('timeout');
    expect(document.background.annotations[0].value).toBe('1000');
    expect(document.background.title).toBe('A long time ago');
    expect(document.background.steps[0].text).toBe('Giveth first background step');
    expect(document.background.steps[0].generalised).toBe('first background step');
    expect(document.background.steps[1].text).toBe('Background steps can still be free form');
    expect(document.background.steps[1].generalised).toBe('Background steps can still be free form');
    expect(document.scenarios[0].annotations[0].name).toBe('browser');
    expect(document.scenarios[0].annotations[0].value).toBe('Firefox');
    expect(document.scenarios[0].title).toBe('First scenario');
    expect(document.scenarios[0].steps[0].text).toBe('Giveth first step');
    expect(document.scenarios[0].steps[1].text).toBe('Whence second step');
    expect(document.scenarios[1].title).toBe('Second scenario');
    expect(document.scenarios[1].steps[0].text).toBe('Thence third step');
    expect(document.scenarios[1].steps[1].text).toBe('And fourth step');
    expect(document.scenarios[2].title).toBe('Third scenario');
    expect(document.scenarios[2].steps[0].text).toBe('Steps can still be free form');
  });

  it('should report missing languages', () => {
    const text = [
      '#language: Missing',
      'Feature: Some feature',
    ].join('\n');


    expect(() => SpecificationParser.parse(text)).toThrow('Language: Missing was not found');
  });

  it('should parse specifications in the specified language', () => {
    const text = [
      '@skip',
      'Tale: Some feature',
      '',
      'Pieces of eight',
      '',
      '   @timeout=1000',
      '   Aftground: A long time ago',
      '      Giveth first background step',
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

    const language = new Languages.Pirate();
    const document = SpecificationParser.parse(text, { language });

    expect(document.description).toBe('Pieces of eight');
    expect(document.annotations[0].name).toBe('skip');
    expect(document.annotations[0].value).toBe(true);
    expect(document.title).toBe('Some feature');
    expect(document.background.annotations[0].name).toBe('timeout');
    expect(document.background.annotations[0].value).toBe('1000');
    expect(document.background.title).toBe('A long time ago');
    expect(document.background.steps[0].text).toBe('Giveth first background step');
    expect(document.background.steps[0].generalised).toBe('first background step');
    expect(document.scenarios[0].annotations[0].name).toBe('browser');
    expect(document.scenarios[0].annotations[0].value).toBe('Firefox');
    expect(document.scenarios[0].title).toBe('First scenario');
    expect(document.scenarios[0].steps[0].text).toBe('Giveth first step');
    expect(document.scenarios[0].steps[1].text).toBe('Whence second step');
    expect(document.scenarios[1].title).toBe('Second scenario');
    expect(document.scenarios[1].steps[0].text).toBe('Thence third step');
    expect(document.scenarios[1].steps[1].text).toBe('And fourth step');
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

    const result1 = SpecificationParser.parse(text1);
    const result2 = SpecificationParser.parse(text2);

    expect(result1.title).toBe('Some feature');
    expect(result2.title).toBe('Another feature');
  });

  it('should support multiline steps', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '   First background step',
      '      Docstring 1',
      '      Docstring 2',
      '         Docstring 3',
      '      Docstring 4   ',
      '   Second background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      First step',
      '         Docstring 1',
      '         Docstring 2',
      '            Docstring 3',
      '         Docstring 4   ',
      '     Second step',
    ].join('\n');

    const document = SpecificationParser.parse(text);

    expect(document.background.steps.length).toBe(2);
    expect(document.background.steps[0].text).toBe('First background step');
    expect(document.background.steps[0].docstring.length).toBe(4);
    expect(document.background.steps[0].docstring[0]).toBe('Docstring 1');
    expect(document.background.steps[0].docstring[1]).toBe('Docstring 2');
    expect(document.background.steps[0].docstring[2]).toBe('   Docstring 3');
    expect(document.background.steps[0].docstring[3]).toBe('Docstring 4   ');
    expect(document.background.steps[1].text).toBe('Second background step');

    expect(document.scenarios.length).toBe(1);
    expect(document.scenarios[0].steps.length).toBe(2);
    expect(document.scenarios[0].steps[0].text).toBe('First step');
    expect(document.scenarios[0].steps[0].docstring.length).toBe(4);
    expect(document.scenarios[0].steps[0].docstring[0]).toBe('Docstring 1');
    expect(document.scenarios[0].steps[0].docstring[1]).toBe('Docstring 2');
    expect(document.scenarios[0].steps[0].docstring[2]).toBe('   Docstring 3');
    expect(document.scenarios[0].steps[0].docstring[3]).toBe('Docstring 4   ');
    expect(document.scenarios[0].steps[1].text).toBe('Second step');
  });

  it('should support multiline steps in the specified language', () => {
    const text = [
      '@skip',
      'Feature: Some feature',
      '',
      'Some free form text',
      '',
      '   @timeout=1000',
      '   Background: The background',
      '   Given a background step',
      '      Given a docstring',
      '      Given another docstring',
      '   Given another background step',
      '',
      '   @browser = Firefox',
      '   Scenario: First scenario',
      '      Given a step',
      '         Given a docstring',
      '         Given another docstring',
      '     Given another step',
    ].join('\n');

    const language = new Languages.English();
    const document = SpecificationParser.parse(text, { language });

    expect(document.background.steps.length).toBe(2);
    expect(document.background.steps[0].generalised).toBe('a background step');
    expect(document.background.steps[0].docstring.length).toBe(2);
    expect(document.background.steps[0].docstring[0]).toBe('Given a docstring');
    expect(document.background.steps[0].docstring[1]).toBe('Given another docstring');
    expect(document.background.steps[1].generalised).toBe('another background step');

    expect(document.scenarios.length).toBe(1);
    expect(document.scenarios[0].steps.length).toBe(2);
    expect(document.scenarios[0].steps[0].generalised).toBe('a step');
    expect(document.scenarios[0].steps[0].docstring.length).toBe(2);
    expect(document.scenarios[0].steps[0].docstring[0]).toBe('Given a docstring');
    expect(document.scenarios[0].steps[0].docstring[1]).toBe('Given another docstring');
    expect(document.scenarios[0].steps[1].generalised).toBe('another step');
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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('@skip', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim simple annotation names', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('@skip   ');
        expect(event.data.name).toBe('skip');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('@skip   ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('@browser=firefox', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim name value annotations', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe(' @browser = firefox ');
        expect(event.data.name).toBe('browser');
        expect(event.data.value).toBe('firefox');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse(' @browser = firefox ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Feature: Some feature', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim feature titles', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('Feature:   Some feature   ');
        expect(event.data.title).toBe('Some feature');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Feature:   Some feature   ', { machine });

      expect(state.count).toBe(1);
    });

    it('should localise feature keyword', () => {

      const state = new StubState((event) => {
        expect(event.source.line).toBe('Feature:   Some feature   ');
        expect(event.data.title).toBe('Some feature');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Feature:   Some feature   ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Scenario: Some scenario', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim scenario titles', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('Scenario:   Some scenario   ');
        expect(event.data.title).toBe('Some scenario');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Scenario:   Some scenario   ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Background: Some background', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim background titles', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('Background:   Some background   ');
        expect(event.data.title).toBe('Some background');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Background:   Some background   ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('', { machine });

      expect(state.count).toBe(1);
    });

    it('should emit blank line events (2)', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('blank_line');
        expect(event.source.line).toBe('  ');
        expect(event.source.number).toBe(1);
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('  ', { machine });

      expect(state.count).toBe(1);
    });
  });

  describe('Step', () => {

    it('should emit step events when matching localised steps', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('step');
        expect(event.source.line).toBe('Given some step');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Given some step');
        expect(event.data.generalised).toBe('some step');
      });

      const machine = new StateMachine({ state });
      const language = new Languages.English();
      SpecificationParser.parse('Given some step', { machine, language });

      expect(state.count).toBe(1);
    });

    it('should trim localised steps', () => {
      const state = new StubState((event) => {
        expect(event.data.text).toBe('Given some step');
        expect(event.data.generalised).toBe('some step');
      });

      const machine = new StateMachine({ state });
      const language = new Languages.English();
      SpecificationParser.parse('   Given some step  ', { machine, language });

      expect(state.count).toBe(1);
    });

    it('should emit step events when matching unlocalised text', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('step');
        expect(event.source.line).toBe('Some step');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Some step');
        expect(event.data.generalised).toBe('Some step');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('Some step', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim unlocalised steps', () => {
      const state = new StubState((event) => {
        expect(event.data.text).toBe('Some step');
        expect(event.data.generalised).toBe('Some step');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('   Some step  ', { machine });

      expect(state.count).toBe(1);
    });
  });

  describe('Text', () => {

    it('should emit text events when not matching localised steps', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('text');
        expect(event.source.line).toBe('Some text');
        expect(event.source.number).toBe(1);
        expect(event.data.text).toBe('Some text');
      });

      const machine = new StateMachine({ state });
      const language = new Languages.English();
      SpecificationParser.parse('Some text', { machine, language });

      expect(state.count).toBe(1);
    });

    it('should trim text', () => {
      const state = new StubState((event) => {
        expect(event.data.text).toBe('Some text');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('   Some text  ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('#Some comment', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim single line comments', () => {
      const state = new StubState((event) => {
        expect(event.name).toBe('single_line_comment');
        expect(event.source.line).toBe('  #   Some comment   ');
        expect(event.data.text).toBe('Some comment');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('  #   Some comment   ', { machine });

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

      const machine = new StateMachine({ state });
      SpecificationParser.parse('###Some comment', { machine });

      expect(state.count).toBe(1);
    });

    it('should trim multi line comments', () => {
      const state = new StubState((event) => {
        expect(event.source.line).toBe('  ####   Some comment   ');
        expect(event.data.text).toBe('Some comment');
      });

      const machine = new StateMachine({ state });
      SpecificationParser.parse('  ####   Some comment   ', { machine });

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
