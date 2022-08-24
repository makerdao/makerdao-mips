Feature: MD Viewer

Background: Default
  Given The user navigates md-view for MIP1c4 first subproposal
Scenario: Left navigation panel updates the hash in the url and scrolls the section into view
  When The user clicks the last entry in the content table
  Then The section name should match the location hash
  And The view should scroll to the section

Scenario: Scroll down/up should update the hash in url and the selected header in left panel
  And The viewport is extremely stretch
  When The user scrolls to the header "2"
  Then The location hash should match the header "2"
  And The entry corresponding to section "2" in the content table should be active
  When The user scrolls to the header "1"
  Then The location hash should match the header "1"
  And The entry corresponding to section "1" in the content table should be active

# Dark Mode
Scenario: Left navigation panel updates the hash in the url and scrolls the section into view (Dark Mode)
  And Dark mode is toggled
  When The user clicks the last entry in the content table
  Then The section name should match the location hash
  And The view should scroll to the section

Scenario: Scroll down/up should update the hash in url and the selected header in left panel (Dark Mode)
  And The viewport is extremely stretch
  And Dark mode is toggled
  When The user scrolls to the header "2"
  Then The location hash should match the header "2"
  And The entry corresponding to section "2" in the content table should be active
  When The user scrolls to the header "1"
  Then The location hash should match the header "1"
  And The entry corresponding to section "1" in the content table should be active

# Spanish
Scenario: Left navigation panel updates the hash in the url and scrolls the section into view (Spanish)
  And The user selects "Spanish" language
  When The user clicks the last entry in the content table
  Then The section name should match the location hash
  And The view should scroll to the section

Scenario: Scroll down/up should update the hash in url and the selected header in left panel (Spanish)
  And The viewport is extremely stretch
  And The user selects "Spanish" language
  When The user scrolls to the header "2"
  Then The location hash should match the header "2"
  And The entry corresponding to section "2" in the content table should be active
  When The user scrolls to the header "1"
  Then The location hash should match the header "1"
  And The entry corresponding to section "1" in the content table should be active
