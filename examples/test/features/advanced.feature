@skip
Feature: Advanced examples

  Scenario: A multiline step (a.k.a. DocString) using a list converter
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
