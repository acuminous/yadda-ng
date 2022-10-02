# Yadda-ng

## Feature Set

### Gherkish

| Feature                   | Supported By                        | Examples                                                                                                                                                                                                                                                                                            |
| ------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language selection        | Feature                             | <code>#language: French</code><br/><code>Fonctionnalité: Une fonctionnalité</code>                                                                                                                                                                                                                  |
| Annotations (boolean)     | Feature, Background, Scenario, Step | <code>@name</code>                                                                                                                                                                                                                                                                                  |
| Annotations (key / value) | Feature, Background, Scenario, Step | <code>@name=value</code>                                                                                                                                                                                                                                                                            |
| Annotations (repeated)    | Feature, Background, Scenario, Step | <code>@name=one</code></br><code>@name=two</code>                                                                                                                                                                                                                                                   |
| Section titles            | Feature, Background, Scenario       | <code>Feature: A feature</code>                                                                                                                                                                                                                                                                     |
| DocStrings (explicit)     | Background, Scenario                | <code>Scenario: A scenario</code><br/><code>Given a thing</code><br/><code>---</code><br/><code>This</code><br/><code>is</code><br/><code>a</code><br/><code>DocString</code><br/><code>---</code><br/><code>And another thing</code>                                                               |
| DocStrings (explicit)     | Background, Scenario                | <code>Scenario: A scenario</code><br/><code>Given a thing</code><br/><code>&nbsp;&nbsp;&nbsp;This</code><br/><code>&nbsp;&nbsp;&nbsp;is</code><br/><code>&nbsp;&nbsp;&nbsp;a</code><br/><code>&nbsp;&nbsp;&nbsp;DocString</code><br/><code>And another thing</code>                                 |
| Free form steps           | Background, Scenario                | <code>Scenario: A scenario</code><br/><code>Whatever text you like</code>                                                                                                                                                                                                                           |
| Single line comments      | All                                 | <code>\# A comment</code>                                                                                                                                                                                                                                                                           |
| Block comments            | All                                 | <code>\#\#\#</code><br/><code>A</code><br/><code>block</code><br/><code>comment</code><br/><code>\#\#\#</code>                                                                                                                                                                                      |
| ~Example Tables~          |                                     | <code>Where:</code><br/><code>&nbsp;&nbsp;&nbsp;\|Height\|Width\|</code><br/><code>&nbsp;&nbsp;&nbsp;\|------\|-----\|</code><br/><code>&nbsp;&nbsp;&nbsp;\|10m&nbsp;&nbsp;&nbsp;\|3m&nbsp;&nbsp;&nbsp;\|</code><br/><code>&nbsp;&nbsp;&nbsp;\|12m&nbsp;&nbsp;&nbsp;\|4m&nbsp;&nbsp;&nbsp;\|</code> |

### Other

| Feature                                         | Supported By                       | Example                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pending steps (specification)                   | Feature, Scenario, Step            | <code>@name</code></br><code>Feature: A feature</code>                                                                                                                                                                                                                           |
| Pending steps (step definition)                 | Library                            | <code>library.define('Given a thing')</code>                                                                                                                                                                                                                                     |
| Pending steps (runtime)                         | Step Implementation                | <code>return { status: BaseStep.PENDING }</code>                                                                                                                                                                                                                                 |
| Suggests step text                              | MochaPlaybook                      | <code>Error: Undefined Step: [Given a thing]</code><br/><code>Suggestion:.define('Given a thing', (state) => { // your code here })</code>                                                                                                                                       |
| Reports ambiguous steps                         | MochaPlaybook                      | <code>Error: Ambiguous Step: [Given a thing] is equally matched by signature [/^Given a (\w+)] derived from template [Given a $thing] defined in library [Library One], signature [Given a (\w+)] derived from template [Given a $thang] defined in library [Library Two]</code> |
| Ambiguous step resolution (prefer last library) | Core                               |                                                                                                                                                                                                                                                                                  |
| Step Functions (synchronous)                    | Library                            | <code>.define('Given a thing', (state) => { // your code here })</code>                                                                                                                                                                                                          |
| Step Functions (asynchronous)                   | Library                            | <code>.define('Given a thing', async (state) => { // your code here })</code>                                                                                                                                                                                                    |
| ~Step Functions (callback)~                     |                                    |                                                                                                                                                                                                                                                                                  |
| Term conversion (simple)                        | Dictionary                         | <code>.define('height', /(\d+)ft/i, new NumberConverter())</code>                                                                                                                                                                                                                |
| ~Term conversion (DocString)~                   |                                    |                                                                                                                                                                                                                                                                                  |
| Shared state                                    | Step Implementation, MochaPlaybook | <code>(state) => {</code><br/><code>&nbsp;&nbsp;state.set('name', 'value', State.FEATURE_SCOPE);</code><br/><code>}</code>                                                                                                                                                       |

### Languages

- English
- Pirate
- None

### Parameter Converters

- Boolean
- Date
- List
- Lowercase
- Number
- Uppercase
