# Language: English

Feature: Converter examples

  Yadda ships with the following converters

  * A boolean converter
  * A date converter
  * A numeric converter

  Scenario: Demonstrate the boolean converter
    Given something is true
    Then the argument should be a boolean

  Scenario: Demonstrate the date converter
    Given the date is 2018/12/25
    Then the argument should be a date

  Scenario: Demonstrate the number converter with an integer
    Given a value of 123
    Then the argument should be a number

  Scenario: Demonstrate the number converter with a float
    Given a value of 123.4
    Then the argument should be a number
