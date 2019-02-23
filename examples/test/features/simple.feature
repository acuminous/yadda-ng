Feature: Simple examples

  The Yadda syntax is similar to Gherkin, but not identical.

    * Yadda supports block comments
    * Scenarios can have example tables as well as Scenario Outlines
    * You can use [ ] as well as < > to specify place holders
    * Data table headings can have a horizontal border row beneath the header
    * You cannot use scenario or background descriptions
    * DocStrings are delimited by indentation, 3 or more dashes or 3 or more quotes

  @timeout = 1000
  Background:
    Given an 8ft empty wall

  Scenario: A simple scenario with parameterised steps
    Given 100 green bottles are standing on the wall
    When 1 green bottle accidentally falls
    Then there are 99 green bottles standing on the wall

  Scenario: A simple scenario with a pluralised step
    Given 100 green bottles are standing on the wall
    When 5 green bottles accidentally fall
    Then there are 95 green bottles standing on the wall

  @skip
  Scenario: A skipped scenario
    Given 100 green bottles are standing on the wall
    When 1 green bottle accidentally falls
    Then there are 99 green bottles standing on the wall

  Scenario: A step is skipped
    Given 100 green bottles are standing on the wall
    When 1 green bottle accidentally falls
    @skip
    Then there are 99 green bottles standing on the wall

  @skip
  Scenario: A step is missing
    Given 100 green bottles are sitting on the wall
    When 1 green bottle accidentally falls
    Then there are 99 green bottles standing on the wall

  Scenario: An indented DocString scenario
    When I spray the following graffiti on the wall:

      Should the not so British Rail,
      On occasion come to fail,
      Or the speed of locomotion,
      Be reduced to that of snail,
      Keep a sturdy upper lip,
      In the form you know is true,
      While upholding that great tradition,
      Of stuffing bog roll down the loo!

    Then there is no more room for graffiti

  Scenario: An explicit DocString scenario
    When I spray the following graffiti on the wall:

    ---
    Should the not so British Rail,
    On occasion come to fail,
    Or the speed of locomotion,
    Be reduced to that of snail,
    Keep a sturdy upper lip,
    In the form you know is true,
    While upholding that great tradition,
    Of stuffing bog roll down the loo!
    ---

    Then there is no more room for graffiti
