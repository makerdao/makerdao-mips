Feature: Regular Search

 Scenario: Performing regular search
    Given The user opens the main page
    When The user types 'proposal' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The details of each MIP should contain 'proposal'
