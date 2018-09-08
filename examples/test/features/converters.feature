# Language: English

Feature: Converters

  Yadda ships with the following converters

  * A boolean converter
  * A date converter
  * A numeric converter

  Scenario: Demonstrate the boolean converter
    Given a true value
    Then the argument should be a boolean

  Scenario: Demonstrate the date converter
    Given a 2018/12/25 value
    Then the argument should be a date

  Scenario: Demonstrate the number converter
    Given a 123 value
    Then the argument should be a number

