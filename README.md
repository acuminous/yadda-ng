# Yadda-ng

## Feature Set

### Gherkish

| Feature                    | Supported By                        | Examples                                                                                                                                                                          |
| -------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language selection         | Feature                             | #language: Français<br/>Fonctionnalité: Une fonctionnalité                                                                                                                        |
| Annotations (raw)          | Feature, Background, Scenario, Step | @name=value                                                                                                                                                                       |
| Annotations (boolean)      | Feature, Background, Scenario, Step | @namee<br/>@name=true                                                                                                                                                             |
| Annotations (date)         | Feature, Background, Scenario, Step | @name=2022/01/01                                                                                                                                                                  |
| Annotations (number)       | Feature, Background, Scenario, Step | @name=100                                                                                                                                                                         |
| Annotations (string)       | Feature, Background, Scenario, Step | @name=value                                                                                                                                                                       |
| Mutliple annotations       | Feature, Background, Scenario, Step | @name=one</br>@name=two                                                                                                                                                           |
| Single line section titles | Feature, Background, Scenario       | Feature: A feature<br/>                                                                                                                                                           |
| Explicit DocStrings        | Background, Scenario                | Scenario: A scenario<br/>Given ...<br/>---<br/>This<br/>is<br/>a<br/>DocString<br/>---<br/>When ...                                                                               |
| Implicit DocStrings        | Background, Scenario                | Scenario: A scenario<br/>Given ...<br/>&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;This<br/>&nbsp;&nbsp;&nbsp;is<br/>&nbsp;&nbsp;&nbsp;a<br/>&nbsp;&nbsp;&nbsp;DocString<br/>And ... |
| Free form steps            | Background, Scenario                | Scenario: A scenario<br/>Whatever ...                                                                                                                                             |
| Single line comments       | All                                 | \# Some comment                                                                                                                                                                   |
| Block comments             | All                                 | \#\#\#<br/>A<br/>block<br/>comment<br/>\#\#\#                                                                                                                                     |
