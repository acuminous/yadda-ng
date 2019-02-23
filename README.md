# yadda-ng

1. Steps should be able to mark themselves, scenarios and features as pending (e.g. abort)
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
  - Directives (language) - Language cannot be locallised (because by implication the language has not yet been set)
1. Dedupe scenario and feature
1. Add filename to specification parser for better error messages
1. .yaddarc
