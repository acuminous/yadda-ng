const Debug = require('debug');
const Annotations = require('./Annotations');
const Feature = require('./Feature');
const Scenario = require('./Scenario');
const Libraries = require('./Libraries');
const { DynamicStep } = require('./Steps');

/*
TODO Script is the adapts parsed specifications into Features, Scenarios and Steps.

Its complicated because
- backgrounds must be copied into each scenario
- libraries must be selected for each scenario

However the name sucks!
*/

module.exports = class Script {
  constructor(props) {
    const { specifications, debug = Debug('yadda:Script') } = props;

    this._specifications = specifications;
    this._debug = debug;
  }

  compile({ libraries }) {
    const libs = new Libraries({ libraries });
    return this._specifications.map((specification) => this._compileFeature(libs, specification));
  }

  _compileFeature(libraries, feature) {
    const annotations = this._compileAnnotations(feature.annotations);
    const libraryNames = this._getLibraryNames(annotations);
    const title = feature.title;
    const scenarios = this._compileScenarios(libraries, libraryNames, feature.background, feature.scenarios);
    return new Feature({ annotations, title, scenarios });
  }

  _compileScenarios(libraries, libraryNames, background, scenarios) {
    return scenarios.map((scenario) => {
      const merged = this._mergeBackground(background, scenario);
      return this._compileScenario(libraries, libraryNames, merged);
    });
  }

  _mergeBackground(background, scenario) {
    return background
      ? {
          title: scenario.title,
          annotations: background.annotations.concat(scenario.annotations),
          steps: background.steps.concat(scenario.steps),
        }
      : scenario;
  }

  _compileScenario(libraries, featureLibraryNames, scenario) {
    const annotations = this._compileAnnotations(scenario.annotations);
    const scenarioLibraryNames = this._getLibraryNames(annotations);
    const scenarioLibraries = libraries.select(featureLibraryNames.concat(scenarioLibraryNames));
    const title = scenario.title;
    const steps = scenario.steps.map((step) => this._compileStep(scenarioLibraries, step));
    return new Scenario({ annotations, title, steps });
  }

  _getLibraryNames(annotations) {
    return annotations.has('libraries') ? annotations.get('libraries').value.split(/\s*,\s*/) : [];
  }

  _compileStep(libraries, step) {
    const annotations = this._compileAnnotations(step.annotations);
    const { text, generalised, docString } = step;
    return new DynamicStep({ libraries, annotations, text, generalised, docString });
  }

  _compileAnnotations(annotations = {}) {
    return annotations.reduce((acc, { name, value }) => acc.add(name, value), new Annotations());
  }
};
