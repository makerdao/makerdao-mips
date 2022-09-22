Feature: MIP Sets View

  Background: Mock
    Given Backend data is set to be mocked

  Scenario: MIP Sets View (English)
    Given The user opens the main page
    When The user clicks the menu option for MIP Sets
    And The user selects English language
    Then The view should contain the three groupings with the given columns
    And The headings of the columns should match in English

  Scenario: MIP Sets View (Spanish)
    Given The user opens the main page
    When The user clicks the menu option for MIP Sets
    And The user selects Spanish language
    Then The view should contain the three groupings with the given columns
    And The headings of the columns should match in Spanish

  Scenario: MIP Sets View (English - Darkmode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the menu option for MIP Sets
    And The user selects English language
    Then The view should contain the three groupings with the given columns
    And The headings of the columns should match in English
    And The main container should use the darkmode classes

  Scenario: MIP Sets View (Spanish - Darkmode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the menu option for MIP Sets
    And The user selects Spanish language
    Then The view should contain the three groupings with the given columns
    And The headings of the columns should match in Spanish
    And The main container should use the darkmode classes


