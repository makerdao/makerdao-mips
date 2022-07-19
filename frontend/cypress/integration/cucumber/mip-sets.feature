Feature: MIP Sets View

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




