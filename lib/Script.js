const debug = require('debug')('yadda:Script');
const os = require('os');
const Annotations = require('./Annotations');
const Feature = require('./Feature');
const Scenario = require('./Scenario');
const Librarian = require('./Librarian');
const { DynamicStep } = require('./Steps');

// The job of a script is to compile json based feature specficiations into a domain model
module.exports = class Script {
  constructor({ specifications }) {
    this.specifications = specifications;
  }

  compile({ libraries }) {
    const librarian = new Librarian({ libraries });
    const features = this.specifications.map((feature) => this._compileFeature(librarian, feature));
    return features;
  }

  _compileFeature(librarian, feature) {
    const annotations = this._compileAnnotations(feature.annotations);
    const title = feature.title;
    const scenarios = this._compileScenarios(librarian, feature.background, feature.scenarios);
    return new Feature({ annotations, title, scenarios });
  }

  _compileScenarios(librarian, background, scenarios) {
    return scenarios.map((scenario) => {
      const merged = this._mergeBackground(background, scenario);
      return this._compileScenario(librarian, merged);
    });
  }

  _mergeBackground(background, scenario) {
    return background ? {
      title: scenario.title,
      annotations: background.annotations.concat(scenario.annotations),
      steps: background.steps.concat(scenario.steps),
    } : scenario;
  }

  _compileScenario(librarian, scenario) {
    // TODO nothing sets scenario libraries - Doh!
    const scenarioLibrarian = librarian.filter(scenario.libraries);
    const annotations = this._compileAnnotations(scenario.annotations);
    const title = scenario.title;
    const steps = scenario.steps.map((step) => this._compileStep(scenarioLibrarian, step));
    return new Scenario({ annotations, title, steps });
  }

  _compileStep(librarian, step) {
    const annotations = this._compileAnnotations(step.annotations);
    const text = step.text;
    const generalised = step.generalised;
    const docString = step.docString.join(os.EOL);
    return new DynamicStep({ librarian, annotations, text, generalised, docString });
  }

  _compileAnnotations(annotations = {}) {
    return annotations.reduce((acc, { name, value }) => acc.add(name, value), new Annotations());
  }
};
