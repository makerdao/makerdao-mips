Feature: Dollar Sign search by tag

  Background: Default
    Given Backend data is set to be mocked
    And Origin "http://159.203.86.45:3001" is set to be mocked as baseUrl with alias "mips"

 Scenario:Search MIP containing given tag (core unit)
    Given The user opens the main page
    And The user selects English language
    When Types $'core unit' in the search bar plus Esc and Enter
    Then The mips should be requested with the search criteria "$ #core unit"

  Scenario:Search MIP containing given tag (mip-set)
    Given The user opens the main page
    And The user selects English language
    When Types $'mip-set' in the search bar plus Esc and Enter
    Then The mips should be requested with the search criteria "$ #mip-set"

  Scenario:Search MIP containing given tag (collateral-onboarding)
    Given The user opens the main page
    And The user selects English language
    When Types $'collateral-onboarding' in the search bar plus Esc and Enter
    Then The mips should be requested with the search criteria "$ #collateral-onboarding"







