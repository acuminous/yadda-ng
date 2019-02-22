Feature: Advanced examples

  @Libraries=Duplicate Library 1
  Scenario: Avoid step clashes by limiting the scenario to a set of libraries (1)
    Given a step that is repeated in multiple libraries
    When the step is invoked
    Then it should be selected from Duplicate Library 1

  @Libraries=Duplicate Library 2
  Scenario: Avoid step clashes by limiting the scenario to a set of libraries (2)
    Given a step that is repeated in multiple libraries
    When the step is invoked
    Then it should be selected from Duplicate Library 2

  @Skip
  Scenario: A multiline step (a.k.a. DocString) using a list converter
    Given the following bottles are standing on the wall

      a) 40 green
      b) 30 brown
      c) 30 clear

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall

  @Skip
  Scenario: A multiline step (a.k.a. doc string) using a table converter
    Given the following bottles are standing on the wall

      | Number | Colour |
      |--------|--------|
      | 40     | green  |
      | 30     | brown  |
      | 30     | clear  |

    When 1 green bottle accidentally falls
    Then there are 39 green bottles standing on the wall
