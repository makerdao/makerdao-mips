Feature: Multi Queries View

  # -----Testing title should be in a param in the URL-----
  # Default
  Scenario: Testing title should be in a param in the URL
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then The title header should match the customViewName param in the URL

  # Dark Mode
  Scenario: Testing title should be in a param in the URL (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the menu option for Core Unit
    Then The title header should match the customViewName param in the URL
    And The main container should use the darkmode classes

  # Spanish
  Scenario: Testing title should be in a param in the URL (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks the menu option for Core Unit
    Then The title header should match the customViewName param in the URL
    And The headings of the columns should match in Spanish


  # ------Testing groups Active Subproposals and Archive must exist------
  # Default
  Scenario: Testing groups Active Subproposals and Archive must exist
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then Both groups must exist

  # Dark Mode
  Scenario: Testing groups Active Subproposals and Archive must exist (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the menu option for Core Unit
    Then Both groups must exist
    And The main container should use the darkmode classes

  # Spanish
  Scenario: Testing groups Active Subproposals and Archive must exist (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks the menu option for Core Unit
    Then Both groups must exist
    And The headings of the columns should match in Spanish


  # ------Query params must exist in the URL------
  # Default
  Scenario: Query params must exist in the URL
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then Query params must exist in the URL

  # Dark Mode
  Scenario: Query params must exist in the URL (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the menu option for Core Unit
    Then Query params must exist in the URL
    And The main container should use the darkmode classes

  # Spanish
  Scenario: Query params must exist in the URL (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks the menu option for Core Unit
    Then Query params must exist in the URL
    And The headings of the columns should match in Spanish

  # ------All columns must be visible------
  # Default
  Scenario: All columns must be visible
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then All columns must be visible

  # Dark Mode
  Scenario: All columns must be visible (Dark Mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the menu option for Core Unit
    Then All columns must be visible
    And The main container should use the darkmode classes

  # Spanish
  Scenario: All columns must be visible (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks the menu option for Core Unit
    Then All columns must be visible
    And The headings of the columns should match in Spanish

