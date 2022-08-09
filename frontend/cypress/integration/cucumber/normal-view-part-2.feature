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

# Related to Components
#  Default
 Scenario: Component opens on MIPS where they are present
    Given The user opens the main page
    When The user clicks dropdown icon on the row corresponding to MIP "10"
    Then The component "3" belonging to MIP "10" should appear in the row right below it
#  Dark mode
 Scenario: Component opens on MIPS where they are present (Dark mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks dropdown icon on the row corresponding to MIP "10"
    Then The component "3" belonging to MIP "10" should appear in the row right below it
#  Spanish
 Scenario: Component opens on MIPS where they are present (Spanish)
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks dropdown icon on the row corresponding to MIP "10"
    Then The component "3" belonging to MIP "10" should appear in the row right below it


# Related to subproposals
#  Default
 Scenario: SubProposals open on MIPS where they are present
    Given The user opens the main page
    When The user clicks dropdown icon on the row corresponding to MIP "4"
    And The user opens the sub-proposals menu of component "2" of MIP "4"
    Then The list of subproposals belonging to component "2" of MIP "4" should appear in the row right below it
    When The user clicks on subproposal "5" of component "2" of MIP "4"
    Then The view page corresponding to subproposal "5" of component "2" of MIP "4" should open
    And The open page should contain the name of the sproposal "5" of component "2" of MIP "4" as main header

#  Dark mode
 Scenario: SubProposals open on MIPS where they are present
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks dropdown icon on the row corresponding to MIP "4"
    And The user opens the sub-proposals menu of component "2" of MIP "4"
    Then The list of subproposals belonging to component "2" of MIP "4" should appear in the row right below it
    When The user clicks on subproposal "5" of component "2" of MIP "4"
    Then The view page corresponding to subproposal "5" of component "2" of MIP "4" should open
    And The open page should contain the name of the sproposal "5" of component "2" of MIP "4" as main header

#  Spanish
 Scenario: SubProposals open on MIPS where they are present
    Given The user opens the main page
    And The user selects "Spanish" language
    When The user clicks dropdown icon on the row corresponding to MIP "4"
    And The user opens the sub-proposals menu of component "2" of MIP "4"
    Then The list of subproposals belonging to component "2" of MIP "4" should appear in the row right below it
    When The user clicks on subproposal "5" of component "2" of MIP "4"
    Then The view page corresponding to subproposal "5" of component "2" of MIP "4" should open
    And The open page should contain the name of the sproposal "5" of component "2" of MIP "4" as main header
