Feature: Dollar Sign search combined

  Background: Default
    Given Backend data is set to be mocked

  Scenario:Search MIPs containing given statuses combinations (ACCEPTED OR OBSOLETE)
    Given The user opens the main page
    When Types ACCEPTED,OBSOLETE in the search bar plus Enter
    Then The mips should be requested with the search criteria "$OR(@ACCEPTED,@OBSOLETE)"

  Scenario:Search MIPs containing given statuses combinations (RFC OR OBSOLETE)
    Given The user opens the main page
    When Types RFC,OBSOLETE in the search bar plus Enter
    Then The mips should be requested with the search criteria "$OR(@RFC,@OBSOLETE)"

  Scenario:Search MIPs containing a combination of tags (collateral-onboarding, mip-set)
    Given The user opens the main page
    Given The user selects the English language
    When Types the tags collateral-onboarding, mip-set combined with AND in the search bar plus Enter
    Then The mips should be requested with the search criteria "$ AND(#collateral-onboarding,#mip-set)"

  Scenario:Search MIPs containing a combination of tags (core unit, facilitator, personnel-xboarding)
    Given The user opens the main page
    Given The user selects the English language
    When Types the tags with core unit, facilitator, personnel-xboarding AND in the search bar plus Enter
    Then The mips should be requested with the search criteria "$ AND(#core unit,#facilitator,#personnel-xboarding)"







