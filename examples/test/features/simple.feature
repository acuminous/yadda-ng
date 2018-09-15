# Language: English

Feature: Simple examples

  The Yadda syntax is similar to Gherkin, but not identical.

  * Yadda supports block comments
  * Scenarios can have example tables as well as Scenario Outlines
  * You can use [ ] as well as < >
  * Data tables headings can have a horizontal border row beneath the header
  * You cannot use scenario or background descriptions

  @timeout = 1000
  Background:
    Given an empty wall

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

  @only
  Scenario: A step is missing
    Given 100 green bottles are sitting on the wall
    When 1 green bottle accidentally falls
    Then there are 99 green bottles standing on the wall

###
  Scenario: A multiline step (a.k.a. docstring) using a list converter
    Given the following bottles are standing on the wall

      a) 40 green
      b) 30 brown
      c) 30 clear

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall

  Scenario: A multiline step (a.k.a. doc string) using a table converter
    Given the following bottles are standing on the wall

      | Number | Colour |
      |--------|--------|
      | 40     | green  |
      | 30     | brown  |
      | 30     | clear  |

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall

  Scenario: A multiline step (a.k.a. doc string) using prose
    Given the following bottles are standing on the wall:

      A stormy night with lashing waves
      To send the sailors to their graves
      The howling wind brings mist and fog
      The captain notes this in his log

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall
###
