Feature: Normal view part 2

# Related to MIP's
#  Default
 Scenario: Mip's link navigates to right page
    Given The user opens the main page
    When The user clicks the row corresponding to MIP "6"
    Then The view page corresponding to MIP "6" should open
    And The open page should contain the title of MIP "6"
#  Dark mode
 Scenario: Mip's link navigates to right page (Dark mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the row corresponding to MIP "6"
    Then The view page corresponding to MIP "6" should open
    And The open page should contain the title of MIP "6"
#  Spanish
 Scenario: Mip's link navigates to right page (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks the row corresponding to MIP "6"
    Then The view page corresponding to MIP "6" should open
    And The open page should contain the title of MIP "6"

# Related to Components and SubProposals
#  Default
 Scenario: Component opens on MIPS where they are present
    Given The user opens the main page
    And The user opens all MIPs containing components
    And The user opens all components containing subproposals
    When The user clicks the first subproposal in descendent order
    Then The view page corresponding to selected Mip-Component-Subproposal should open
    And The open page should contain the title corresponding to Mip-Component-Subproposal
#  Dark mode
 Scenario: Component opens on MIPS where they are present
    Given The user opens the main page
    And Dark mode is toggled
    And The user opens all MIPs containing components
    And The user opens all components containing subproposals
    When The user clicks the first subproposal in descendent order
    Then The view page corresponding to selected Mip-Component-Subproposal should open
    And The open page should contain the title corresponding to Mip-Component-Subproposal
#  Spanish
 Scenario: Component opens on MIPS where they are present
    Given The user opens the main page
    And The user selects "Spanish" language
    And The user opens all MIPs containing components
    And The user opens all components containing subproposals
    When The user clicks the first subproposal in descendent order
    Then The view page corresponding to selected Mip-Component-Subproposal should open
    And The open page should contain the title corresponding to Mip-Component-Subproposal
