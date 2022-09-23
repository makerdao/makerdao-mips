Feature: Normal view part 2

   Background: Mock
      Given Backend data is set to be mocked


   #  Default
   Scenario: Mip's link navigates to right page
      Given The user opens the main page
      When The user clicks the row corresponding to MIP "6"
      Then The view page corresponding to MIP "6" should open
      And The open page should contain the title of MIP "6"

   Scenario: Subproposal and component open on MIPS where they are present
      Given The user opens the main page
      And Find all request is mocked to return components instead
      And The user opens all MIPs containing components
      And The user opens all components containing subproposals
      When The user clicks the first subproposal in ascendent order
      Then The view page corresponding to selected Mip-Component-Subproposal should open

   #  Dark mode
   Scenario: Mip's link navigates to right page (Dark mode)
      Given The user opens the main page
      And Dark mode is toggled
      When The user clicks the row corresponding to MIP "6"
      Then The view page corresponding to MIP "6" should open
      And The open page should contain the title of MIP "6"

   Scenario: Subproposal and component open on MIPS where they are present (Dark Mode)
      Given The user opens the main page
      And Dark mode is toggled
      And Find all request is mocked to return components instead
      And The user opens all MIPs containing components
      And The user opens all components containing subproposals
      When The user clicks the first subproposal in ascendent order
      Then The view page corresponding to selected Mip-Component-Subproposal should open

   #  Spanish
   Scenario: Mip's link navigates to right page (Spanish)
      Given The user opens the main page
      And The user selects "Spanish" language
      When The user clicks the row corresponding to MIP "6"
      Then The view page corresponding to MIP "6" should open
      And The open page should contain the title of MIP "6"

   Scenario: Subproposal and component open on MIPS where they are present (Spanish)
      Given The user opens the main page
      And The user selects "Spanish" language
      And Find all request is mocked to return components instead
      And The user opens all MIPs containing components
      And The user opens all components containing subproposals
      When The user clicks the first subproposal in ascendent order
      Then The view page corresponding to selected Mip-Component-Subproposal should open
