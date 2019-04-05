# yadda-ng

1. Ignore step returns (breaking examples)
1. Look at whether initial state cant create a feature without being passed specification
1. Specification Parser
  - Example tables
1. Injectable / Configurable competition
1. Term should use arity class
1. Terms should be recursive: .define('coordinates', '$number, $number', new GeographicCoordinatesConverter());
1. Term errors should be better when 0 matching groups: Error: Pattern [$number, $number] for term [coordinates] has only 0 matching groups, but a total of 2 converter arguments were specified
1. Make argument validation injectable
1. Localisation
  - Other languages
  - All specification parser regexes
  - Annotations (pending)
    - The MochaPlugin uses annotations too.
    - Possible solution - pass the language into the annotations and add a language identifier to get and has functions, e.g. getAnnotation('timeout', 'en')
    - Needs to be extensible (e.g. mocha plugin has timeouts - need to be able to extend localisation)
    - BaseLanguage only generalises steps
    - Proper model for language
      - generalise(text, language)
      - localise(text, language)
      - define(term, translations)
    - Must tolerate partially complete languages (fallback to English)
  - Directives (language) - Language cannot be localised (because by implication the language has not yet been set)
1. Dedupe scenario and feature
1. Add filename to specification parser for better error messages
1. .yaddarc
1. Rename specification => feature / specifications => features?


#### Annotations
1. Vocabulary needs to be dynamic
1. Vocabulary should just be a list of word mappings with two functions
    1. generalise
    2. localise

1. Add annotation language to constructor
1. Generalise annotation name passed to constructor
1. Generalise annotation name when added
1. If no generalisation exists leave as is
1. Generalise given name in answers to
1. Mocha plugin should add vocabulary
