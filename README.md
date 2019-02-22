# yadda-ng

1. Specification Parser
  - Example tables
1. Injectable / Configurable competition
1. Term should use arity class
1. Terms should be recursive: .define('coordinates', '$number, $number', new GeographicCoordinatesConverter());
1. Term errors should be better when 0 matching groups: Error: Pattern [$number, $number] for term [coordinates] has only 0 matching groups, but a total of 2 converter arguments were specified
1. State should be immutable (watch out for UndefinedStep)
1. State history
1. Make argument validation injectable
1. Localisation
  - Other languages
  - All specification parser regexes
  - Annotations (pending)
  - Directives (language)
1. Dedupe scenario and feature
1. Add filename to specification parser for better error messages
1. .yaddarc
