# yadda-ng

1. Steps should be pending after an undefined step
1. Term should use arity class
1. Terms should be recursive: .define('coordinates', '$number, $number', new GeographicCoordinatesConverter());
1. Term errors should be better when 0 matching groups: Error: Pattern [$number, $number] for term [coordinates] has only 0 matching groups, but a total of 2 converter arguments were specified
1. Scenarios need to get libraries from annotations (see Script)
1. Script should die. Instead maybe compile steps from scenarios
1. hasAnnotationsIgnoreCase
1. State should be immutable (watch out for UndefinedStep)
1. State history
1. Injectable / Configurable competition
1. Make argument validation injectable
1. Consider removing MultiConverter
1. Localisation
  - Other languages
  - All specification parser regexes
1. Feature Parser
1. Dedupe scenario and feature
