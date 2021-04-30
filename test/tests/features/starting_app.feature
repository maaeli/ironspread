@system
Feature: Last data is reloaded
  As a client,
  I want to see the last saved state when I open the app,
  so that I can see where I stopped.

  Scenario: Table is displayed
    Given the App has been started
    When I look at the GUI
    Then I see a table

  Scenario: Initial table header
    Given the App has been started
    When I look at the GUI
    Then I see a table with the header
      | column 0 | column 1 | column 2 | column 3 |
      | |  A | B | C |
      | | bank a | bank b | bank c | 

  Scenario: Initial table row label
    Given the App has been started
    When I look at the GUI
    Then I see a table with the row labels '1','2'
