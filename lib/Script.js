const Debug = require('debug');
const Annotations = require('./Annotations');
const Feature = require('./Feature');
const Scenario = require('./Scenario');
const Librarian = require('./Librarian');
const { DynamicStep } = require('./Steps');

module.exports = class Script {

  constructor(props) {
    const {
      specifications,
      debug = Debug('yadda:Script'),
    } = props;

    this._specifications = specifications;
    this._debug = debug;
  }

  compile({ libraries }) {
    const librarian = new Librarian({ libraries });
    const features = this._specifications.map((feature) => this._compileFeature(librarian, feature));
    return features;
  }

  _compileFeature(librarian, feature) {
    const annotations = this._compileAnnotations(feature.annotations);
    const libraryNames = this._getLibraryNames(annotations);
    const title = feature.title;
    const scenarios = this._compileScenarios(librarian, libraryNames, feature.background, feature.scenarios);
    return new Feature({ annotations, title, scenarios });
  }

  _compileScenarios(librarian, libraryNames, background, scenarios) {
    return scenarios.map((scenario) => {
      const merged = this._mergeBackground(background, scenario);
      return this._compileScenario(librarian, libraryNames, merged);
    });
  }

  _mergeBackground(background, scenario) {
    return background ? {
      title: scenario.title,
      annotations: background.annotations.concat(scenario.annotations),
      steps: background.steps.concat(scenario.steps),
    } : scenario;
  }

  _compileScenario(librarian, featureLibraryNames, scenario) {
    const annotations = this._compileAnnotations(scenario.annotations);
    const scenarioLibraryNames = this._getLibraryNames(annotations);
    const scenarioLibrarian = librarian.select(featureLibraryNames.concat(scenarioLibraryNames));
    const title = scenario.title;
    const steps = scenario.steps.map((step) => this._compileStep(scenarioLibrarian, step));
    return new Scenario({ annotations, title, steps });
  }

  _getLibraryNames(annotations) {
    return annotations.has('libraries') ? annotations.get('libraries').value.split(/\s*,\s*/) : [];
  }

  _compileStep(librarian, step) {
    const annotations = this._compileAnnotations(step.annotations);
    const { text, generalised, docString } = step;
    return new DynamicStep({ librarian, annotations, text, generalised, docString });
  }

  _compileAnnotations(annotations = {}) {
    return annotations.reduce((acc, { name, value }) => acc.add(name, value), new Annotations());
  }
};
