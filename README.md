# yadda-ng

1. DynamicStep tests
1. State history
1. Multiple signatures per step
1. Injectable / Configurable competition
1. Make argument validation injectable
1. Consider removing MultiConverter
1. Find a home for suggestions?
suggest(statement) {
  const generalised = this._language.generalise(statement);
  return `.define('${generalised}', () => { // your code here })`;
}
1. All steps return outcome { err, status, suggestion }
1. Localisation
1. Feature Parser
