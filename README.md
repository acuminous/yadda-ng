# Yadda-ng

## Feature Set

### Gherkish

| Feature                    | Supported By                        | Examples                                                                                                                                                                 |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Language selection         | Feature                             | #language: Français<br/>Fonctionnalité: Une fonctionnalité                                                                                                               |
| Boolean annotations        | Feature, Background, Scenario, Step | @name                                                                                                                                                                    |
| Key Value annotations      | Feature, Background, Scenario, Step | @name=value                                                                                                                                                              |
| Mutliple value annotations | Feature, Background, Scenario, Step | @name=one</br>@name=two                                                                                                                                                  |
| Single line section titles | Feature, Background, Scenario       | Feature: A feature<br/>                                                                                                                                                  |
| Explicit DocStrings        | Background, Scenario                | Scenario: A scenario<br/>Given a thing<br/>---<br/>This<br/>is<br/>a<br/>DocString<br/>---<br/>And another thing                                                         |
| Implicit DocStrings        | Background, Scenario                | Scenario: A scenario<br/>Given a thing<br/>&nbsp;&nbsp;&nbsp;This<br/>&nbsp;&nbsp;&nbsp;is<br/>&nbsp;&nbsp;&nbsp;a<br/>&nbsp;&nbsp;&nbsp;DocString<br/>And another thing |
| Free form steps            | Background, Scenario                | Scenario: A scenario<br/>Whatever ...                                                                                                                                    |
| Single line comments       | All                                 | \# A comment                                                                                                                                                             |
| Block comments             | All                                 | \#\#\#<br/>A<br/>block<br/>comment<br/>\#\#\#                                                                                                                            |
| ~Example Tables~           |                                     | Where:<br/><table><tr><th>Height</th><th>Width</th></tr><tr><td>1m</td><td>2m</td></tr><tr><td>3m</td><td>4m</td></tr></table>                                           |
