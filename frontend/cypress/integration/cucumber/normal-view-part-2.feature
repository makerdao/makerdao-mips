Feature: Normal view part 2

 Scenario: Component opens on MIPS where they are present
    Given The user opens the main page
    When The user clicks the row corresponding to MIP "6"
    Then The view page corresponding to MIP "6" should open
    And The open page should contain the title of MIP "6"

 Scenario: Component opens on MIPS where they are present (Dark mode)
    Given The user opens the main page
    And Dark mode is toggled
    When The user clicks the row corresponding to MIP "6"
    Then The view page corresponding to MIP "6" should open
    And The open page should contain the title of MIP "6"

 Scenario: Component opens on MIPS where they are present (English)
    Given The user opens the main page
    And The user selects "English" language
    When The user clicks the row corresponding to MIP "6"
    Then The view page corresponding to MIP "6" should open
    And The open page should contain the title of MIP "6"


#  Scenario: Component opens on MIPS where they are present
#     Given The user opens the main page
#     When The user clicks a MIP with "2"
#     Then The corresponding MIP view should open in "2"
