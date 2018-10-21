Feature: Advanced examples

  The Yadda syntax is similar to Gherkin, but not identical.

    * Yadda supports block comments
    * Scenarios can have example tables as well as Scenario Outlines
    * You can use [ ] as well as < >
    * Data tables headings can have a horizontal border row beneath the header
    * You cannot use scenario or background descriptions
    * DocStrings are delimited by indentation not triple quotes

@only
Scenario: A multiline step (a.k.a. DocString) using prose
  Given the following graffiti is sprayed on the wall

    May we go our separate ways,
    Finding fortune and new friends.
    But let us not forget these days,
    Or let the good times ever end.

    A poet with wiser words than mine,
    Wrote that nothing gold can stay.
    These are golden days we're in,
    And so are bound to fade away.

    This is the Springtime of my life,
    What comes I only have to fear.
    Unknown horizons beckon me,
    And yet my heart is stuck fast here.

  Then there are 3 verses
  When I add the following verse

    That was the Springtime of my life,
    The fear of change has lost its hold.
    For now I know that golden green,
    Is but a paler shade of Autumn gold.

  Then there are 4 verses



###
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
###
