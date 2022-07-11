Feature: Normal view

 Scenario:Main view should have all columns (english)
    Given The user opens the main page
    And The user selects English language
    Then The MIps list should have the given columns in English

  Scenario:Main view should have all columns (spanish)
    Given The user opens the main page
    And The user selects Spanish language
    Then The MIps list should have the given columns in Spanish

  Scenario: Main view should be initially be sorted by #
    Given The user opens the main page
    Then The MIPs list should be sorted by #

  Scenario: Sorting by title
    Given The user opens the main page
    When The user clicks the title column header
    Then The MIps list should be sorted by title ascending
    When The user clicks the title column header again
    Then The MIps list should be sorted by title descending

  Scenario: Sorting by status
    Given The user opens the main page
    When The user clicks the status column header
    Then The MIps list should be sorted by status ascending
    When The user clicks the status column header again
    Then The MIps list should be sorted by status descending

  Scenario: Loading more MIPs when scrolling
    Then The MIps list should have length 10
    And Loading plus component should not exist
    When The user scrolls to the bottom
    Then Loading plus component should be visible
    And The MIPs list should have length 20
    And Loading plus component should not exist
    When The user scrolls to the bottom
    Then Loading plus component should be visible
    And The MIPs list should have length 30
    And Loading plus component should not exist
