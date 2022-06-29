Feature: Regular Search

 Scenario: Performing regular search (proposal)
    Given The user opens the main page
    When The user types 'proposal' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The details of each MIP should contain 'proposal'

  Scenario: Performing regular search (reference)
    Given The user opens the main page
    When The user types 'reference' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The details of each MIP should contain 'reference'

  Scenario: Performing MIPs search (MIP1)
    Given The user opens the main page
    When The user types MIP'1' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The MIPs found should contain the value '1' in its pos column

  Scenario: Performing MIPs search (MIP2)
    Given The user opens the main page
    When The user types MIP'2' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The MIPs found should contain the value '2' in its pos column
