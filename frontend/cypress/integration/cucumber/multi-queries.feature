Feature: Multi Queries View

 Scenario: Testing title should be in a param in the URL
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then The title header should match the customViewName param in the URL

  Scenario: Testing groups Active Subproposals and Archive must exist
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then Both groups must exist


  Scenario: Query params must exist in the URL
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then Query params must exist in the URL

  Scenario: All columns must be visible
    Given The user opens the main page
    When The user clicks the menu option for Core Unit
    Then All columns must be visible




