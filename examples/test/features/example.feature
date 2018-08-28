Feature: Examples

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

  Scenario: A step is missing
    Given 100 green kegs are standing on the wall
    When 1 green keg accidentally falls
    Then there are 99 green kegs standing on the wall

###
  Scenario: A list based multiline step
    Given the following bottles are standing on the wall:

      - 40 green
      - 30 brown
      - 30 clear

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall

  Scenario: A table based multiline step
    Given the following bottles are standing on the wall:

      | Number | Colour |
      |--------|--------|
      | 40     | green  |
      | 30     | brown  |
      | 30     | clear  |

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall

  Scenario: A prose based multiline step
    Given the following bottles are standing on the wall:

      A stormy night with lashing waves
      To send the sailors to their graves
      The howling wind brings mist and fog
      The captain notes this in his log

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall
###
