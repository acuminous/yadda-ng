const debug = require('debug')('yadda-ng:Script');
const Annotations = require('./Annotations');
const Feature = require('./Feature');
const Scenario = require('./Scenario');
const Librarian = require('./Librarian');

// The job of a Script is to compile Features
module.exports = class Script {
  constructor({ source }) {
    this.source = source;
  }

  compile({ libraries }) {
    const librarian = new Librarian({ libraries });
    const features = this.source.map((feature) => this._compileFeature(librarian, feature));
    return features;
  }

  _compileFeature(librarian, feature) {
    const annotations = this._compileAnnotations(feature.annotations);
    const title = feature.title;
    const scenarios = feature.scenarios.map((scenario) => this._compileScenario(librarian, scenario));
    return new Feature({ annotations, title, scenarios });
  }

  _compileScenario(librarian, scenario) {
    const libraries = librarian.filter(scenario.libraries);
    const annotations = this._compileAnnotations(scenario.annotations);
    const title = scenario.title;
    const steps = scenario.steps.map((step) => this._compileStep(libraries, step));
    return new Scenario({ annotations, title, steps });
  }

  _compileStep(librarian, step) {
    const annotations = this._compileAnnotations(step.annotations);
    const text = step.text;
    return librarian.createStep(annotations, text);
  }

  _compileAnnotations(annotations = {}) {
    return Object.keys(annotations)
      .reduce((acc, name) => acc.add(name, annotations[name]), new Annotations());
  }
};
