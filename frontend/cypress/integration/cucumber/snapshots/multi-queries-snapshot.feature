Feature: Nulti queries snapshots

  Background: Preset conditions
    Given The viewport is fixed to macbook-16
    And Search params are passed in the url

  Scenario: Global Snapshot
    Then Global snapshot matches with image "multi-queries-view/entire-view"

  Scenario Outline: Specific Snapshot
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                    |
      | Title | app-list-page .container | multi-queries-view/title |
      | Table | table                    | multi-queries-view/table |

  #Dark Mode
  Scenario: Global Snapshot (Dark Mode)
    And Dark mode is toggled
    Then Global snapshot matches with image "multi-queries-view/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                         |
      | Title | app-list-page .container | multi-queries-view/title-dark |
      | Table | table                    | multi-queries-view/table-dark |


  #Spanish
  Scenario: Global Snapshot (Spanish)
    And The user selects "Spanish" language
    Then Global snapshot matches with image "multi-queries-view/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    And The user selects "Spanish" language
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                            |
      | Title | app-list-page .container | multi-queries-view/title-spanish |
      | Table | table                    | multi-queries-view/table-spanish |
