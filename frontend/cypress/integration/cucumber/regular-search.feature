Feature: Regular Search

  Background: Mock
    Given Backend data is set to be mocked

  Scenario: Performing regular search (proposal)
    Given The user opens the main page
    And English language is selected
    When The user types 'proposal' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The mips should be requested with the search criteria "proposal"

  Scenario: Performing regular search (reference)
    Given The user opens the main page
    And English language is selected
    When The user types 'reference' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The mips should be requested with the search criteria "reference"

  Scenario: Performing MIPs search (MIP1)
    Given The user opens the main page
    When The user types MIP'1' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The mips should be requested with filter field "mipName" with value "MIP1"

  Scenario: Performing MIPs search (MIP2)
    Given The user opens the main page
    When The user types MIP'2' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The mips should be requested with filter field "mipName" with value "MIP2"

  Scenario: Performing MIPs search (MIP5)
    Given The user opens the main page
    When The user types MIP'5' in the search box
    And Hits Enter
    Then The list of MIPs should be visible
    And The mips should be requested with filter field "mipName" with value "MIP5"

