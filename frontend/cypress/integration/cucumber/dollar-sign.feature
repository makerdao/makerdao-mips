Feature: Dollar Sign search by tag

 Scenario:Search MIP containing given tag (core unit)
    Given The user opens the main page
    And The user selects English language
    When Types $'core unit' in the search bar plus Esc and Enter
    Then The found MIps should contain the tag 'core unit'

  Scenario:Search MIP containing given tag (mip-set)
    Given The user opens the main page
    And The user selects English language
    When Types $'mip-set' in the search bar plus Esc and Enter
    Then The found MIps should contain the tag 'mip-set'

  Scenario:Search MIP containing given tag (collateral-onboarding)
    Given The user opens the main page
    And The user selects English language
    When Types $'collateral-onboarding' in the search bar plus Esc and Enter
    Then The found MIps should contain the tag 'collateral-onboarding'







