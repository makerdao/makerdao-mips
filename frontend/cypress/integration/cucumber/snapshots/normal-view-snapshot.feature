Feature: Normal view snapshots

  Background: Preset conditions
    Given Backend data is set to be mocked
    And The viewport is fixed to 1536x600
    And The user opens the main page

  Scenario: Global Snapshot
    Then Global snapshot matches with image "normal-view/entire-view"

  Scenario Outline: Specific Snapshot
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                      |
      | Table  | [data-cy=table-list-mips]          | normal-view/mips-table     |
      | Header | [data-cy=table-list-mips] thead tr | normal-view/mip-row-header |
      | Row    | [data-cy=table-list-mips] tbody tr | normal-view/mip-row        |

  Scenario: MIP description
    Then MIP description component matches snapshot with image "normal-view/mip-row-with-expanded-description"

  Scenario: MIP components
    Then MIP component matches snapshot with image "normal-view/mip-row-with-expanded-components"

  #Dark Mode
  Scenario: Global Snapshot (Dark Mode)
    And Dark mode is toggled
    Then Global snapshot matches with image "normal-view/entire-view-dark"

  Scenario Outline: Specific Snapshot (Dark Mode)
    And Dark mode is toggled
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                           |
      | Table  | [data-cy=table-list-mips]          | normal-view/mips-table-dark     |
      | Header | [data-cy=table-list-mips] thead tr | normal-view/mip-row-header-dark |
      | Row    | [data-cy=table-list-mips] tbody tr | normal-view/mip-row-dark        |

  Scenario: MIP description (Dark Mode)
    And Dark mode is toggled
    Then MIP description component matches snapshot with image "normal-view/mip-row-with-expanded-description-dark"

  Scenario: MIP components (Dark Mode)
    And Dark mode is toggled
    Then MIP component matches snapshot with image "normal-view/mip-row-with-expanded-components-dark"

  #Spanish
  Scenario: Global Snapshot (Spanish)
    And The user selects "Spanish" language
    And Vars data is set to be mocked in spanish
    Then Global snapshot matches with image "normal-view/entire-view-spanish"

  Scenario Outline: Specific Snapshot (Spanish)
    And The user selects "Spanish" language
    And Vars data is set to be mocked in spanish
    Then "<name>" component with selector "<selector>" matches snapshot for image name "<image>"
    Examples:
      | name   | selector                           | image                              |
      | Table  | [data-cy=table-list-mips]          | normal-view/mips-table-spanish     |
      | Header | [data-cy=table-list-mips] thead tr | normal-view/mip-row-header-spanish |
      | Row    | [data-cy=table-list-mips] tbody tr | normal-view/mip-row-spanish        |

  Scenario: MIP description (Spanish)
    And The user selects "Spanish" language
    And Vars data is set to be mocked in spanish
    Then MIP description component matches snapshot with image "normal-view/mip-row-with-expanded-description-spanish"

  Scenario: MIP components (Spanish)
    And The user selects "Spanish" language
    And Vars data is set to be mocked in spanish
    Then MIP component matches snapshot with image "normal-view/mip-row-with-expanded-components-spanish"
