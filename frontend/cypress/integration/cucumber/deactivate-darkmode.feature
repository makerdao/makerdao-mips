Feature: Deactivating The DarkMode

Scenario: Deactivating Dark Mode
  Given The user opens the main page
  And   Activates darkmode
  When The user clicks the darkmode toggler again
  Then The main container should NOT use the darkmode classes
