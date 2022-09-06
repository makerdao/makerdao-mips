Feature: MIP sets snapshots

  Background: Preset conditions
    Given The viewport is fixed to 1536x600
    And Backend data is set to be mocked
    And The user opens MIP Sets view
    And The go-to-top button is removed from the view

  Scenario: Global Snapshot
    And MIP Set number "1" is open
    Then Global snapshot matches with image "mip-sets/entire-view"
    And MIP Set number "1" should match snapshot with image suffix "content"


  Scenario: Global Snapshot (Dark Mode)
    And Dark mode is toggled
    And MIP Set number "1" is open
    Then Global snapshot matches with image "mip-sets/entire-view-dark"
    And MIP Set number "1" should match snapshot with image suffix "content-dark"

  Scenario: Global Snapshot (Spanish)
    And The user selects "Spanish" language
    And MIP Set number "1" is open
    Then Global snapshot matches with image "mip-sets/entire-view-spanish"
    And MIP Set number "1" should match snapshot with image suffix "content-spanish"