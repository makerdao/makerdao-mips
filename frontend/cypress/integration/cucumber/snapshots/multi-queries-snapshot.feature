Feature: Multi queries snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked

  ##---------------------DESKTOP-----------------------
  Scenario: Global Snapshot
    Given The viewport is fixed to 1536x600
    And Search params are passed in the url
    Then Global snapshot matches with image "multi-queries-view/entire-view"

  Scenario Outline: Specific Snapshot
    Given The viewport is fixed to 1536x600
    And Search params are passed in the url
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                    |
      | Title | app-list-page .container | multi-queries-view/title |
      | Table | table                    | multi-queries-view/table |

  #Dark Mode
  Scenario: Global Snapshot (Dark Mode)
    Given The viewport is fixed to 1536x600
    And Search params are passed in the url
    And Dark mode is toggled
    Then Global snapshot matches with image "multi-queries-view/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
    Given The viewport is fixed to 1536x600
    And Search params are passed in the url
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                         |
      | Title | app-list-page .container | multi-queries-view/title-dark |
      | Table | table                    | multi-queries-view/table-dark |


  #Spanish
  Scenario: Global Snapshot (Spanish)
    Given The viewport is fixed to 1536x600
    And Search params are passed in the url
    And The user selects "Spanish" language
    Then Global snapshot matches with image "multi-queries-view/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    Given The viewport is fixed to 1536x600
    And Search params are passed in the url
    And The user selects "Spanish" language
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                            |
      | Title | app-list-page .container | multi-queries-view/title-spanish |
      | Table | table                    | multi-queries-view/table-spanish |

  ##---------------------MOBILE-----------------------
  Scenario: Global Snapshot (Mobile)
    Given The viewport is fixed to 375x667
    And Search params are passed in the url
    Then Global snapshot matches with image "multi-queries-view/entire-view-mobile"

  Scenario Outline: Specific Snapshot (Mobile)
    Given The viewport is fixed to 375x667
    And Search params are passed in the url
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                           |
      | Title | app-list-page .container | multi-queries-view/title-mobile |

  #Dark Mode
  Scenario: Global Snapshot (Mobile) (Dark Mode)
    Given The viewport is fixed to 375x667
    And Search params are passed in the url
    And Dark mode is toggled
    Then Global snapshot matches with image "multi-queries-view/entire-view-dark-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Dark Mode)
    Given The viewport is fixed to 375x667
    And Search params are passed in the url
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                                |
      | Title | app-list-page .container | multi-queries-view/title-dark-mobile |


  #Spanish
  Scenario: Global Snapshot (Mobile) (Spanish)
    Given The viewport is fixed to 375x667
    And Search params are passed in the url
    And The user selects "Spanish" language
    Then Global snapshot matches with image "multi-queries-view/entire-view-spanish-mobile"

  Scenario Outline: Specific Snapshot (Mobile) (Spanish)
    Given The viewport is fixed to 375x667
    And Search params are passed in the url
    And The user selects "Spanish" language
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name  | selector                 | image                                   |
      | Title | app-list-page .container | multi-queries-view/title-spanish-mobile |
