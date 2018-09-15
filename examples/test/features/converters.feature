# Language: English

Feature: Converter examples

  Yadda ships with the following converters

  * A boolean converter
  * A date converter
  * A numeric converter

  Scenario: Step parameters can be converted to booleans
    Given something is true
    Then the argument should be a boolean

  Scenario: Step parameters can be converted to dates
    Given the date is 2018/12/25
    Then the argument should be a date

  Scenario: Step parameters can be converted to whole numbers
    Given a value of 123
    Then the argument should be a number

  Scenario: Step parameters can be converted to floating point numbers
    Given a value of 123.4
    Then the argument should be a number

  Scenario: Multiple step parameters can be combined
    Given coordinates of 13.28963, 118.23904
    Then the argument should be an object
