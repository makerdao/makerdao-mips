Feature: MIP Details View

Background: Default
  Given The user navigates to details view for mip "6"

Scenario: Left navigation panel updates the hash in the url and scrolls the section into view
  When The user clicks the last entry in the content table
  Then The section name should match the location hash
  And The view should scroll to the section

Scenario: Scroll down/up should update the hash in url and the selected header in left panel
  When The user scrolls to the header "2"
  Then The location hash should match the header "2"
  When The user scrolls to the header "1"
  Then The location hash should match the header "1"

Scenario: Hovering over a MIP link opens a popup containing the Title and the Summary of the MIP
  When The user places the mouse over mip "9" reference
  Then The popup about corresponding mip should appear in the page
  And The open popup about corresponding mip should contain a Summary

Scenario: Tags Section
  When The user clicks the first tag in tags section
  Then The corresponding tag is filled into the search box preceded by a hash code

Scenario: Authors Section
  When The user clicks the first entry in authors section
  Then The url query parameter author is set to the previously selected author entry text

Scenario: Contributors Section
  When The user clicks the first entry in contributors section
  Then The url query parameter author is set to the previously selected contributor entry text


# Dark Mode
Scenario: Left navigation panel updates the hash in the url and scrolls the section into view (Dark Mode)
  And Dark mode is toggled
  When The user clicks the last entry in the content table
  Then The section name should match the location hash
  And The view should scroll to the section

Scenario: Scroll down/up should update the hash in url and the selected header in left panel (Dark Mode)
  And Dark mode is toggled
  When The user scrolls to the header "2"
  Then The location hash should match the header "2"
  When The user scrolls to the header "1"
  Then The location hash should match the header "1"

Scenario: Hovering over a MIP link opens a popup containing the Title and the Summary of the MIP (Dark Mode)
  And Dark mode is toggled
  When The user places the mouse over mip "9" reference
  Then The popup about corresponding mip should appear in the page
  And The open popup about corresponding mip should contain a Summary

Scenario: Tags Section (Dark Mode)
  And Dark mode is toggled
  When The user clicks the first tag in tags section
  Then The corresponding tag is filled into the search box preceded by a hash code

Scenario: Authors Section (Dark Mode)
  And Dark mode is toggled
  When The user clicks the first entry in authors section
  Then The url query parameter author is set to the previously selected author entry text

Scenario: Contributors Section (Dark Mode)
  And Dark mode is toggled
  When The user clicks the first entry in contributors section
  Then The url query parameter author is set to the previously selected contributor entry text


# Spanish
Scenario: Left navigation panel updates the hash in the url and scrolls the section into view (Spanish)
  And The user selects "Spanish" language
  When The user clicks the last entry in the content table
  Then The section name should match the location hash
  And The view should scroll to the section

Scenario: Scroll down/up should update the hash in url and the selected header in left panel (Spanish)
  And The user selects "Spanish" language
  When The user scrolls to the header "2"
  Then The location hash should match the header "2"
  When The user scrolls to the header "1"
  Then The location hash should match the header "1"

Scenario: Hovering over a MIP link opens a popup containing the Title and the Summary of the MIP (Spanish)
  And The user selects "Spanish" language
  When The user places the mouse over mip "9" reference
  Then The popup about corresponding mip should appear in the page
  And The open popup about corresponding mip should contain a Summary

Scenario: Tags Section (Spanish)
  And The user selects "Spanish" language
  When The user clicks the first tag in tags section
  Then The corresponding tag is filled into the search box preceded by a hash code

Scenario: Authors Section (Spanish)
  And The user selects "Spanish" language
  When The user clicks the first entry in authors section
  Then The url query parameter author is set to the previously selected author entry text

Scenario: Contributors Section (Spanish)
  And The user selects "Spanish" language
  When The user clicks the first entry in contributors section
  Then The url query parameter author is set to the previously selected contributor entry text
