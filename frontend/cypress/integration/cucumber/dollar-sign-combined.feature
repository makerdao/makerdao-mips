Feature: Dollar Sign search combined

# TODO add mips variety
# TODO add mip specific files for most/ all added mips

  Background: Default
    Given Backend data is set to be mocked

  Scenario:Search MIPs containing given statuses combinations (ACCEPTED OR OBSOLETE)
    Given The user opens the main page
    When Types ACCEPTED,OBSOLETE in the search bar plus Enter
    Then The found MIps should have the statuses either ACCEPTED or OBSOLETE

  Scenario:Search MIPs containing given statuses combinations (RFC OR OBSOLETE)
    Given The user opens the main page
    When Types RFC,OBSOLETE in the search bar plus Enter
    Then The found MIps should have the statuses either RFC or OBSOLETE

@focus
  Scenario:Search MIPs containing a combination of tags (collateral-onboarding, mip-set)
    Given The user opens the main page
    Given The user selects the English language
    When Types the tags collateral-onboarding, mip-set combined with AND in the search bar plus Enter
    Then The found MIps should have the tags collateral-onboarding, mip-set

  Scenario:Search MIPs containing a combination of tags (core unit, facilitator, personnel-xboarding)
    Given The user opens the main page
    Given The user selects the English language
    When Types the tags with core unit, facilitator, personnel-xboarding AND in the search bar plus Enter
    Then The found MIps should have the tags core unit, facilitator, personnel-xboarding







